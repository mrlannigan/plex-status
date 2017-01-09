/**
 * Original Credit: Derek Rada <derekrada@gmail.com>
 * Original Gist: https://gist.github.com/Dirrk/608642bd820849736ad2
 */

const _ = require('lodash');
const url = require('url');

function getTags(obj) {
    if (_.isArray(obj)) {
        return obj.map(o => o.tag || '');
    } else if (_.isObject(obj)) {
        return [obj.tag];
    }

    return undefined;
}

function getArray(obj, str) {
    const target = _.get(obj, str);

    if (!target) {
        return [];
    }

    if (!_.isArray(target)) {
        return [target];
    }

    return target;
}

function getFirst(obj, str) {
    return _.first(getArray(obj, str));
}

function processOutput(payload) {
    const timestamp = new Date().toISOString();
    const videos = getArray(payload, 'MediaContainer.Video');

    return _.map(videos, (video) => {
        const output = {};

        output.success = true;
        output.timestamp = timestamp;
        output.title = video.title;
        output.plexId = video.ratingKey;
        output.plexType = video.type;
        output.year = video.year;

        if (video.type === 'episode') {
            output.show = video.grandparentTitle;
            output.season = video.parentIndex;
            output.episode = video.index;
        }

        const user = _.get(video, 'User');

        if (user) {
            output.user = user.title;
            output.userId = user.id;
        }

        const player = _.get(video, 'Player');

        if (player) {
            output.platform = player.platform;
            output.device = player.device;
            output.player = player.title;
            output.status = player.state;
            output.player_address = player.address;
        }

        const transcode = _.get(video, 'TranscodeSession');

        if (transcode) {
            output.video_transcoding = transcode.videoDecision;
            output.audio_transcoding = transcode.audioDecision;

            output.throttled = transcode.throttled;
            output.progress = Math.floor(transcode.progress);
        }

        const media = _.get(video, 'Media');

        if (media) {
            output.container = media.container;
            output.resolution = media.videoResolution;
            output.videoCodec = media.videoCodec;
            output.audioCodec = media.audioCodec;
            output.video_height = media.height;
            output.video_width = media.width;
            output.framerate = media.videoFrameRate;
            output.bitrate = media.bitrate;
            output.optimized_for_streaming = media.optimizedForStreaming;

            const part = getFirst(media, 'Part');
            output.file = part.file;
            output.file_size = part.size;
        }

        output.sessionId = _.get(video, 'Session.id');
        output.bandwidth = _.get(video, 'Session.bandwidth');
        output.sessionlocation = _.get(video, 'Session.location');

        output.directors = getTags(_.get(video, 'Director'));
        output.writers = getTags(_.get(video, 'Writer'));
        output.producers = getTags(_.get(video, 'Producer'));
        output.genre = getTags(_.get(video, 'Genre'));
        output.actors = getTags(_.get(video, 'Role'));

        return output;
    });
}

function generateRequestUrl(options) {
    return url.format({
        protocol: options.https ? 'https:' : 'http',
        hostname: options.hostname,
        port: options.port
    });
}

exports.processOutput = processOutput;
exports.generateRequestUrl = generateRequestUrl;

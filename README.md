# plex-status

This module will output the current status of a given plex server. Useful for injestion to splunk or other log analysis tools.

## Credit

Original code is credit of Derek Rada <derekrada@gmail.com> from this original gist: https://gist.github.com/Dirrk/608642bd820849736ad2

## CLI

*Example*
```bash
$ plex-status -t 0000000000000000 --host 192.168.0.0 --port 32400
{"success":true,"timestamp":"2017-01-09T07:06:22.621Z","title":"Ex MachTina","plexId":"6741","plexType":"episode","year":"2017","show":"Bob's Burgers","season":"7","episode":"8","user":"mrlannigan","userId":"1","platform":"Chrome","device":"OSX","player":"Plex Web (Chrome)","status":"paused","player_address":"10.35.0.0","video_transcoding":"copy","audio_transcoding":"transcode","throttled":"1","progress":57,"container":"mkv","resolution":"720","videoCodec":"h264","audioCodec":"ac3","video_height":"718","video_width":"1280","framerate":"24p","bitrate":"1473","file":"/some/file/location/Bob's Burgers/Season 07/Bob's Burgers - S07E08 - Ex MachTina.mkv","file_size":"237242504","sessionId":"000000000000000000","bandwidth":"3094","sessionlocation":"lan"}
```

The command will output a JSON string for each open session on the targeted plex server.

### Usage with Cron and NVM Example

```
* * * * * NODE_VERSION=6 /Users/julian/.nvm/nvm-exec plex-status -t 00000000000000000 >> /var/log/plex/plexstatus.log 2>> /var/log/plex/plexerror.log
```

NOTE: This assumes you have installed this module globally within the given NODE_VERSION.

## API

### .get(options[, callback])

#### Options

* authToken - Plex authenication token
* [hostname] - (localhost) Hostname of plex server
* [port] - (32400) Port of plex server
* [https] - (false) Use HTTPS or not

#### [callback(err, result[])]

If not provided a Promise will be returned.

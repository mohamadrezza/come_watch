const yearRegex = /((20|19)[0-9]{2})/g;

const helpers = {
    getYearRegex() {
        return yearRegex;
    },
    getYearFromMovieName(movieName) {
        let year = movieName.match(yearRegex);
        return year instanceof Array ? year[0] : '';
    },

    getMovieExt(name) {
        let splitted = name.split('.');

        if (this.isDirectory(name) || splitted.length === 0) {
            return "";
        }

        return splitted[splitted.length - 1]
    },

    isValidExt(name) {
        let ext = this.getMovieExt(name);

        return ['mkv', 'mp4', 'avi', 'mov', 'wmv','flv'].includes(ext);

    },

    isDirectory(name) {
        return name[name.length - 1] === '/';
    },

    parseMovieName(name, year) {
        let nameRegex = new RegExp('^(.+?)' + year, 'g');
        let nameParsed = name.match(nameRegex) || {};
        nameParsed = nameParsed[Object.keys(nameParsed)[0]] || name;
        if (nameParsed.length <= 2) {
            nameParsed = name;
        }
        nameParsed = nameParsed
            .replace('.mp4', '')
            .replace('.mkv', '')
            .replace('.avi', '')
            .replace(/\./g, ' ')
            .replace(/_/g, ' ')
            .replace(/\(/g, ' ')
            .replace(/\)/g, ' ')
            .replace(/  +/g, ' ')

        return nameParsed;
    },
    isDubbed(name) {
        let dubbed = name.search('DUBBED')
        if (dubbed == -1) {
            return false
        }
        return true
    },
    getQuality(link){
        let qualities = ['720p' , '1080p' , '480p']

        let q = null;
        qualities.forEach(quality=>{
            if(q !== null){
                return false;
            }

            if(link.includes(quality)){
                q = quality;
            } 
        })

        if(link.includes('3D')){
            q += " " + "3D"
        }

        if(link.includes('x265')){
            q += " " + "x265"
        }
      
      

        return q;
     },
     getRelease(link){
        let releases = [
            'Bluray',
            'BLURAY',
            'bluray',
            'blue-ray',
            'Web-Dl',
            'Web-DL',
            'DivX',
            'DVBRip',
            'WEB DL',
            'WEBRip ',
            'WEB Rip',
            'HC',   
            'BluRay',
            'WEB-DL',
            'WebDL ',
            'webdl',
            'web-dl',
            'HEVC',
            'hevc',
            'HDCam',
            'hdcam',
            'HDRip',
            'hdrip',
            'REMUX',
            'Remux',
            'HDTV',
            'hdtv',
            'BrRip'
        ]

        let r = null;
        releases.forEach(release=>{
            if(r !== null){
                return false;
            }

            if(link.includes(release)){
                r = release;
            } 
        })

        return r;
     }

};


module.exports = helpers;
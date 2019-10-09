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

        return ['mkv', 'mp4', 'avi', 'mov', 'wmv'].includes(ext);

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
    }
};


module.exports = helpers;
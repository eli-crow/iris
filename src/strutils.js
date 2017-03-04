const titleCase = str => str.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

module.exports.titleCase = titleCase;
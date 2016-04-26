var meow = require('meow');

module.exports = meow(`
    Usage
        $ node index <input>

    Options
      -f, --force Force rewrite
      -t, --type operation type
    Example
        $ node index -f
`, {
    alias: {
        f: 'force',
        t : 'type'
    }
});

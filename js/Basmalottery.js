/**
 * Basmalottery.js
 *
 * Dependencies:
 * - UnderscoreJS (or LoDash)
 *
 * Optional Dependencies:
 * - RANDOM.org (if not passing manual randomizer)
 */

// Build a Basmalottery constructor.
var Basmalottery = function(options){
    var self = this;

    /**
     * defaults - The default properties to use for any new instance.
     */
    this.defaults = {
        randomizer: 'randomorg'
    };

    /**
     * properties - The properties of the current object. Any properties passed
     *      into the constructor will override the default properties.
     */
    this.properties = $.extend({}, this.defaults, options);

    /**
     * get - Returns the value of property from the lottery instance.
     *
     * @param  {String} property The property name to return from the instance.
     * @return {Object}          The value of the property on the properties object.
     */
    this.get = function(property) {
        return this.properties[property];
    };

    /**
     * generateNumber - Generates a number between two points, with a minimum
     *      number being 0.
     *
     * @param  {Integer} minimum    The lowest number to generate (no less than 0).
     * @param  {Integer} maximum    The highest number to generate.
     * @return {Integer}            The randomly generated number.
     */
    this.generateNumber = function(minimum, maximum) {
        var randomNumber = null,
            randomizerMethod = this.get('randomizer');

        // We want our generated number to be at least 0.
        minimum = (minimum < 0) ? 0 : minimum;

        // Utilize the RANDOM.org API to generate a random number.
        if (randomizerMethod === 'randomorg') {

        // Utilize JavaScript Math to generate a random number.
        } else {
            randomNumber = Math.floor(Math.random() * maximum) + minimum;
        }

        return randomNumber;
    };

    /**
     * generateWinningNumbers - Randomly generates four winning numbers and
     *      returns them as an array.
     *
     * @param {Integer} count   The number of winning numbers to generate.
     * @return {Array}          The winning numbers.
     */
    this.generateWinningNumbers = function(count) {
        var winningNumbers = [];

        // Add `count` winning numbers (between 1 and 10, inclusive) to the array.
        while (winningNumbers.length < count) {
            // Generate a random number.
            var randomNumber = this.generateNumber(1, 10);

            // Do not add the number if it already has won.
            if (_.contains(winningNumbers, randomNumber)) continue;

            // If we've reached this point, add the random number to the winning list.
            winningNumbers.push(randomNumber);
        }

        return winningNumbers;
    };

    return this;
};

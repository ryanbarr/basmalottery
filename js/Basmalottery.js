/**
 * Basmalottery.js
 * @author Ryan Barr
 *
 * Dependencies:
 * - UnderscoreJS (or LoDash)
 *
 * Optional Dependencies:
 * - RANDOM.org (if not passing manual randomizer)
 *
 * Notes:
 * - When adding methods which don't return an expected value, return the
 *      current lottery instance to allow for method chaining.
 */

// Build a Basmalottery constructor.
var Basmalottery = function(options){
    var self = this;

    /**
     * defaults - The default properties to use for any new instance.
     *      DO NOT MODIFY THESE DEFAULTS. Instead, pass in overriding values
     *      when you create a new instance. For example:
     *          var lottery = new Basmalottery({ maxPlayerTickets: 1337 });
     */
    self.defaults = {
        // The maximum number of tickets a player may have.
        maxPlayerTickets: 10,
        // The players balance. This should be zero and updated in init().
        playerBalance: 0.0,
        // The amount of money a player starts with.
        playerStartingMoney: 10.0,
        // The players current active tickets. By default, this should be empty.
        playerTickets: [],
        // The randomizer to use when generating random numbers.
        randomizer: 'randomorg',
        // The total cost of a single ticket.
        ticketCost: 2.0,
        // The lowest number a ticket can be.
        ticketMinimumNumber: 1,
        // The highest number a ticket can be.
        ticketMaximumNumber: 10
    };

    /**
     * options - We will store the override options so we can reset our game to
     *      its original state at a later point if we choose to do so.
     */
    self.options = options;

    /**
     * properties - The properties of the current object. Any properties passed
     *      into the constructor will override the default properties.
     */
    self.properties = $.extend({}, self.defaults, options);

    /**
     * init - This method gets executed by the constructor upon returning the
     *      new instance.
     */
    self.init = function() {
        // Set the player's balance to the starting money.

    };

    /**
     * get - Returns the value of property from the lottery instance.
     *
     * @param  {String} property The property name to return from the instance.
     * @return {Object}          The value of the property on the properties object.
     */
    self.get = function(property) {
        return self.properties[property];
    };

    /**
     * set - Sets the value of a property on the lottery instance.
     *
     * @param {String} property The property name to set the value of.
     * @param {Object} value    The value to set on the defined property.
     * @return {Object}         Returns the current instance.
     */
    self.set = function(property, value) {
        self.properties[property] = value;
        return self;
    };

    /**
     * generateNumber - Generates a number between two points, with a minimum
     *      number being 0.
     *
     * @param  {Integer} minimum    The lowest number to generate (no less than 0).
     * @param  {Integer} maximum    The highest number to generate.
     * @return {Integer}            The randomly generated number.
     */
    self.generateNumber = function(minimum, maximum) {
        var randomNumber = null,
            randomizerMethod = self.get('randomizer');

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
    self.generateWinningNumbers = function(count) {
        var winningNumbers = [];

        // Add `count` winning numbers to the array.
        while (winningNumbers.length < count) {
            // Generate a random number.
            var randomNumber = self.generateNumber(self.get('ticketMinimumNumber'), self.get('ticketMaximumNumber'));

            // Do not add the number if it already has won.
            if (_.contains(winningNumbers, randomNumber)) continue;

            // If we've reached this point, add the random number to the winning list.
            winningNumbers.push(randomNumber);
        }

        return winningNumbers;
    };

    /**
     * checkNumberMatchCount - Takes a set of numbers and compares them to the
     *          another set numbers and returns a total count of matches.
     *
     * @param  {Array} ticketNumbers    The numbers of a player ticket.
     * @param  {Array} winningNumbers   The winning numbers to check against.
     * @return {Integer}                The count of matches between the arrays.
     */
    self.checkNumberMatchCount = function(ticketNumbers, winningNumbers) {
        // Return the length of the array which includes the matching numbers.
        return _.intersection(ticketNumbers, winningNumbers).length;
    };

    return self;
};

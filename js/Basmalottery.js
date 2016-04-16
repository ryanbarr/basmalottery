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
        // Turns on console.log statements for debugging purposes.
        debug: false,
        // The total numbers expected per ticket.
        maxNumbersPerTicket: 4,
        // The maximum number of tickets a player may have.
        maxPlayerTickets: 10,
        // The players balance. This should be zero and updated in init().
        playerBalance: 0.0,
        // The amount of money a player starts with.
        playerStartingMoney: 10.0,
        // The players current active tickets. By default, this should be empty.
        playerTickets: [],
        // The total number of tickets a player has.
        playerTicketsCount: 0,
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
    self.properties = {};

    /**
     * hooks - Hooks listen for changes to the specified property and fire the
     *      functions listed in the associated array. For example:
     *          'change:playerBalance': ['functionName', 'anotherFunction']
     */
    self.hooks = {
        'change:playerTickets': ['handlePlayerTicketsUpdate']
    };

    /**
     * init - This method gets executed by the constructor upon returning the
     *      new instance.
     *
     * @return {Object}             Returns the current instance.
     */
    self.init = function() {
        // Start a timer so we can debug the weight of initialization.
        var timer = self.timer.start();

        // Bind all hooks to their appropriate events.
        for (var eventName in self.hooks) {
            var methods = self.hooks[eventName];
            $(self).on(eventName, function(){
                for (var methodIndex in methods) {
                    var methodName = methods[methodIndex];
                    self[methodName].apply(self, arguments);
                }
            });
        }

        // Setup data binding. Listen for any change event on our instance.
        $(self).on('change', function(event, property, value) {
            // Update the view to reflect the value of the changed property.
            $('*[data-bind="'+ property +'"]').html(value);
        });

        // Set all properties based on defaults and options.
        _.each($.extend({}, self.defaults, options), function(value, property){
            // Set properties using our setter so we can trigger change events.
            self.set(property, value);
        });

        // Set the player's balance to the starting money.
        self.set('playerBalance', self.get('playerStartingMoney'));

        // Log that initialization is complete.
        self.log('Completed initialization of a new Basmalottery object in '+ timer.stop() +' seconds.');

        // Return the current instance so we can chain methods.
        return self;
    };

    /**
     * get - Returns the value of property from the lottery instance.
     *
     * @param  {String} property    The property name to return from the instance.
     * @return {Object}             The value of the property on the properties object.
     */
    self.get = function(property) {
        // Return the value of the requested property.
        return self.properties[property];
    };

    /**
     * set - Sets the value of a property on the lottery instance.
     *
     * @param {String} property     The property name to set the value of.
     * @param {Object} value        The value to set on the defined property.
     * @return {Object}             Returns the current instance.
     */
    self.set = function(property, value) {
        self.log('Updating `'+ property +'` with value: ', value);

        // Set the value of the property on our properties object.
        self.properties[property] = value;

        // Trigger the global change event so we can handle things like data-binding.
        $(self).trigger('change', [property, value]);

        // Trigger the property change event so we can handle property hooks.
        $(self).trigger('change:'+ property, [property, value]);

        // Return the current instance so we can chain methods.
        return self;
    };

    /**
     * log - Conditionally logs messages to the console based on the debug flag
     *      set on the current instance.
     *
     * @return {Object}             Returns the current instance.
     */
    self.log = function() {
        // If the debug flag is active, console.log as requested.
        if (self.get('debug')) {
            console.log.apply(console, arguments);
        }

        // Return the current instance so we can chain methods.
        return self;
    };

    /**
     * timer - A set of functions which can be used to time synchronous actions.
     */
    self.timer = {
        // The current stored stamps. This should not be access directly.
        stamps: {},

        /**
         * start - Starts a timer and returns a unique timer id.
         *
         * @return {String}  The timer id which is used to stop the timer.
         */
        start: function() {
            // Capture the current timestamp.
            var now = _.now(),
                id = _.uniqueId('timer');

            // Store the stamp so we can see what stamps are active.
            self.timer.stamps[id] = now;

            // Return the stamp id so it can be stopped later.
            return {
                id: id,
                stop: function() {
                    // Attempt to find the timer with the assigned id.
                    if (self.timer.stamps[id]) {
                        var now = _.now(),
                            // Convert the difference of the timestamps to seconds.
                            seconds = ((now - self.timer.stamps[id]) / 1000).toFixed(3);

                        // Delete the property from the object to avoid clutter.
                        delete self.timer.stamps[id];

                        // Return the number of seconds that it took to run this timer.
                        return seconds;
                    } else {
                        // Log that we've attempted stopping a timer that doesn't exist.
                        self.log('Attempted to stop timer `'+ id +'` but it was already stopped.');
                        return -1;
                    }
                }
            };
        }
    };

    // METHODS BELOW THIS LINE SHOULD BE ALPHABETIZED.

    /**
     * addTicket - Binds to a button press or link click and processes the form
     *      on the page with the id #addTicket. It validates the values and will
     *      error if necessary. When a valid ticket is found, it adds it to the
     *      current instance and updates the view.
     *
     * @return {Object}             Returns the current instance.
     */
    self.addTicket = function() {
        // Serialize the form and declare default states.
        var $addTicket = $('#addTicket'),
            form = $addTicket.serializeObject(),
            hasError = false,
            ticket = [],
            currentTickets = self.get('playerTickets'),
            ticketMinimumNumber = self.get('ticketMinimumNumber'),
            ticketMaximumNumber = self.get('ticketMaximumNumber');

        // Reset the form state.
        $('.ticketNumber').removeClass('error');
        $('#error').html('');

        // Iterate over the expected amount of numbers.
        for (var i = 1; i <= self.get('maxNumbersPerTicket'); i++) {
            // Clean the currentNumber and parse it as an integer.
            var currentNumber = parseInt(form['number'+i].trim());

            // Check that the number is real, within our expected range, and not already on our ticket.
            if (!_.isNaN(currentNumber) && currentNumber >= ticketMinimumNumber && currentNumber <= ticketMaximumNumber && !_.contains(ticket, currentNumber)) {
                // Store the number on the current ticket.
                ticket.push(currentNumber);
            // Flag that we have an error and indicate the error on the appropriate field.
            } else {
                hasError = true;
                $('#number'+i).addClass('error');
            }
        }

        // If we have an error, end execution of the function after informing the user of the error.
        if (hasError) {
            $('#error').html('Please fill out all numbers, be sure they are '+ ticketMinimumNumber +'-'+ ticketMaximumNumber +' inclusively, and are unqiue.');
            return self;
        }

        // If we have received a valid ticket, add it to the player's current tickets.
        currentTickets.push(ticket);

        // Clear the form so the user may enter another ticket.
        $addTicket[0].reset();

        // Add the newest ticket to our instance so it persists in memory.
        self.set('playerTickets', currentTickets);

        return self;
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

    /**
     * generateNumber - Generates a number between two points, with a minimum
     *      number being 0.
     *
     * @param  {Integer} minimum    The lowest number to generate (no less than 0).
     * @param  {Integer} maximum    The highest number to generate.
     * @return {Integer}            The randomly generated number.
     */
    self.generateNumber = function(minimum, maximum) {
        // Log that we're generating a random number.
        self.log('Generating a random number between '+ minimum +' and '+ maximum +'.');

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

        // Return the generated number.
        return randomNumber;
    };

    /**
     * generateWinningNumbers - Randomly generates four winning numbers and
     *      returns them as an array.
     *
     * @param {Integer} count       The number of winning numbers to generate.
     * @return {Array}              The winning numbers.
     */
    self.generateWinningNumbers = function(count) {
        // Log that we're generating numbers.
        self.log('Generating '+ count +' winning numbers.');

        // Start a timer that we can use for debugging later.
        var timer = self.timer.start();

        // Declare a variable to store our generated numbers.
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

        // Log that we've completed generating the random numbers.
        self.log('Generated '+ count +' random numbers in '+ timer.stop() +' seconds.');

        // Return the array of winning numbers.
        return winningNumbers;
    };

    /**
     * handlePlayerTicketsUpdate - Event handler for playerTickets updates.
     *
     * @return {Object}             Returns the current instance.
     */
    self.handlePlayerTicketsUpdate = function() {
        // Set the total number of player tickets to the length of the array.
        self.set('playerTicketsCount', self.get('playerTickets').length);

        // Return the current instance so we can chain methods.
        return self;
    };

    return self.init();
};

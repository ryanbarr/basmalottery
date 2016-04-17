# Basmalottery
"Here's something to think about: How come you never see a headline like 'Psychic Wins Lottery'?" - Jay Leno

This is a challenge given to a friend who is taking a web development course and I've decided to do the challenge as well.

## Instructions for Development
```
Build a webpage which does the following:

* The user starts with $10 in virtual money.
* The user enters 4 distinct numbers between 1 and 10, inclusive. (see hint)
* The user presses a button which costs them $2, and the computer generates four distinct random numbers between 1 and 10 inclusive which are shown to the user.
* The user wins money based on n, where n is the number of numbers they guessed correctly. No winnings given if there are no matches. For example, you could do (0 = $0, 1 = $2, 2 = $4, 3 = $16, 4 = $64) or something similar.

## Details

1. Players cannot go into debt. Make sure the player has the money to pay for the lottery ticket. Display an error message if the user has run out of money.
2. Players should be able to play the same numbers over and over, but can change them if they want.
3. There is no upper limit to the amount you can win.
4. Make sure the user has entered valid numbers before they are allowed to play. Display an error message if the user has entered an invalid number.
5. Display an error message if the user has entered two of the same number

## Above and Beyond

1. Make the page beautiful
2. Allow the player to purchase more than one "ticket" before rolling the numbers.
3. Display an animation when the player rolls new numbers.
4. Use localstorage to keep track of the current high score.
```

## Liberties Taken

1. I'm utilizing frameworks rather than reinventing the wheel and utilizing vanilla JavaScript. For this project I'll be using jQuery for field and DOM manipulation as well as Underscore for utility and templating.
2. I've used (2^n)^2 as my winnings formula, where n is the number of matching numbers. If there are no matches, the script prevents running the formula as 2^0^2, because anything to a zero power is one.
3. Only having numbers 1 through 10 gave users too high of odds for winning, which made it nearly impossible to ever reach a zero balance.
4. LocalStorage is used to store the Player's Balance, rather than a "high score", so a player can return to the game later and pick back up.

# SE Calculator
SE Calculator is a single page app designed to help University of Waterloo
Software Engineering students estimate their potential financial situation
during their university careers. Engineering students (and CS students, too)
often find themselves in a position to graduate with little to no debt - and
this tool is designed to help calculate how much debt or profit you'll leave
school with.

See it live at [http://petersobot.com/secalculator](http://petersobot.com/secalculator).


## Installation

    git clone git@github.com:psobot/secalculator

    #   If you use Pow for local dev servers, this
    #   will link up the project to secalculator.dev
    ln -s `pwd`/secalculator ~/.pow/secalculator

## Building & Developing

SE Calculator uses a [Gulp](http://gulpjs.com/)-based build system
and includes a Makefile for convenience. The resulting static HTML
is placed in `public/`. The frontend is an Angular.js app, with a 
custom graphing directive to interface with D3.js.

    make # to build (downloads deps as required)
    make watch # to build every time you change a file

    bin/gulp build # if you feel like calling gulp yourself

    #   Gulp sub-tasks you can run manually if you want
    bin/gulp js
    bin/gulp styles
    bin/gulp haml

## Data

Data is generated based on a bunch of generator functions in `src/js/data.js`.
Modify functions in there to change the default values, add more presets,
change dropdown options or whatever you'd like.

## Legal Disclaimer

**This calculator is not a financial advisor.**

The information on this website is provided for education and informational
purposes only, without any express or implied warranty of any kind, including
warranties of accuracy, completeness, or fitness for any particular purpose.

## Technical Disclaimer

I wrote this late at night with little concern for best practises, instead
trying to get something out before Frosh Week was over so that the 2019 frosh
could use this tool. If you're reading the code, my apologies for its quality.

Having said that, please feel free to jump in and make changes! I'll gladly
review pull requests and fix issues.

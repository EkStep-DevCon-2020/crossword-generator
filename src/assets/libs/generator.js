var cw;


window.onload = function () {

    // new Clipboard('#copy');

    // var regenerate = document.getElementById('regenerate');
    // regenerate.addEventListener('click', generate, false);

    // generate(10, entries);


};


function generate(cwRows, entries) {
    if (typeof entries === 'undefined') {
        alert('Could not find list of words and clues');
        return;
    }

    if (entries.length == 0) {
        alert('Please enter some words and clues to use.');
        return;
    }


    var words = new Array();
    var clues = new Array();

    entries = shuffle(entries);

    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        words[i] = entry.word;
        clues[i] = entry.clue;
    }


    function shuffle(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }


    var r = cwRows || 14 || parseInt(document.getElementById('size').value);
    var c = r;

    if (isNaN(r) || isNaN(c)) {
        alert('rows and/or columns number value invalid!');
        return;

    }
    cw = new Crossword(words, clues, r, c);

    // create the crossword grid (try to make it have a 1:1 width to height ratio in 10 tries)
    var tries = 10;
    var grid = cw.getSquareGrid(tries);

    // report a problem with the words in the crossword
    if (grid == null) {
        var bad_words = cw.getBadWords();
        var str = [];
        for (var i = 0; i < bad_words.length; i++) {
            str.push(bad_words[i].word);
        }
        alert("Shoot! A grid could not be created with these words:\n" + str.join("\n"));
        return;
    }

    // turn the crossword grid into HTML
    var show_answers = true;
    document.getElementById("crossword").innerHTML = CrosswordUtils.toHtml(grid, show_answers);

    // make a nice legend for the clues
    var legend = cw.getLegend(grid);
    globalCW = legend;
    addLegendToPage(legend);
    printJson(legend);
}

function printJson(groups) {
    var puzzle = {};
    puzzle.width = cw.width;
    puzzle.height = cw.height;

    puzzle.acrossClues = new Array();
    puzzle.downClues = new Array();


    for (var k in groups) {
        var html = [];
        for (var i = 0; i < groups[k].length; i++) {
            var g = groups[k][i];
            var item = { answer: g.word, clue: g.clue, x: g.col, y: g.row, };

            if (g.dir == 'H') {
                puzzle.acrossClues.push(item);
            } else {
                puzzle.downClues.push(item);
            }
        }

    }
    puzzle.settings = settings;
    puzzle.labels = labels;


    var json = JSON.stringify(puzzle, null, 4)
    document.getElementById('output').innerHTML = '<pre>' + json + '</pre>';
}

function addLegendToPage(groups) {
    for (var k in groups) {
        var html = [];
        for (var i = 0; i < groups[k].length; i++) {
            html.push("<li><strong>" + groups[k][i]['position'] + ".</strong> " + groups[k][i]['clue'] + "</li>");

        }
        document.getElementById(k).innerHTML = html.join("\n");
    }
}

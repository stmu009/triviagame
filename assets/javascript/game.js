var game = {
    questions: [{

    }],
    getQuestions: function () {
        url = 'https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple'
        $.ajax({
            type: "GET",
            url: url,
            success: function (response) {
                game.questions = response.results
                console.log(JSON.stringify(response.results))
                console.log(game.questions)
            }
        });
    },
    currentQuestion: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    unansweredQuestions: 0,
    startButtonDelay: 2000,
    timer: 5,
    intervalID: '',
    resultTimer: 3,
    startGame: function () {
        $('#start-button').click(function (e) {
            game.hideStartButton()
            game.getQuestions()
            game.correctAnswers = 0
            game.wrongAnswers = 0
            game.unansweredQuestions = 0
        });
    },
    hideStartButton: function () {
        $("#start-button").hide(game.startButtonDelay, function () {
            game.showTimer()
            game.showQuestion()
        });
        // $("#start-button").fadeOut("slow", function(){});
    },
    startTimer: function () {
        counter = 0
        game.updateTimer(game.timer)
        game.intervalID = setInterval(function () {
            counter++
            if (counter <= game.timer) {
                game.updateTimer(game.timer - counter)
            } else {
                game.stopTimer()
                game.outOfTimeResult()
            }
        }, 1000)
    },
    startResultTimer: function () {
        counter = 0
        game.updateTimer(game.resultTimer)
        game.intervalID = setInterval(function () {
            counter++
            if (counter <= game.resultTimer) {
                game.updateTimer(game.resultTimer - counter)
            } else {
                game.stopTimer()
                game.showQuestion()
                game.startTimer()
                game.hideResult()
            }
        }, 1000)
    },
    stopTimer: function () {
        clearInterval(game.intervalID)
    },
    updateTimer: function (timerValue) {
        $('#timer').text(timerValue)
    },
    showTimer: function () {
        $('#timer').text(game.timer);
        $('#timer-row').show();
        game.startTimer();
    },
    hideTimer: function () {
        $('#timer-row').hide();
    },
    showQuestion: function () {
        $('#question-card').show();
        $('#question-title').html(game.questions[game.currentQuestion].question)
        game.showChoices()
    },
    hideQuestion: function () {
        $('#question-card').hide();
    },
    showChoices: function () {
        choices = [...game.questions[game.currentQuestion].incorrect_answers];
        choices.push(game.questions[game.currentQuestion].correct_answer);
        console.log(choices)
        choices.sort(() => Math.random() - 0.5);
        console.log(choices)
        $.each(choices, (index, value) => {
            $('#choice'+index).html(value);
        });
        
    },
    showResult: function () {
        $('#result-card').show();
    },
    hideResult: function () {
        $('#result-card').hide()
    },
    correctAnswerResult: function () {
        $('#result-title').text("Correct!");
        game.currentQuestion++;
        game.correctAnswers++;
        game.hideQuestion();
        game.showResult();
        if (game.currentQuestion > game.questions.length) {
            game.showScores()
        } else {
            game.startResultTimer()
        }
    },
    wrongAnswerResult: function () {
        $('#result-title').text("Incorrect");
        $('#correct-answer').html(game.questions[game.currentQuestion].correct_answer);
        game.currentQuestion++;
        game.wrongAnswers++;
        game.hideQuestion();
        game.showResult();
        if (game.currentQuestion > game.questions.length) {
            game.showScores()
        } else {
            game.startResultTimer()
        }
    },
    outOfTimeResult: function () {
        $('#result-title').text("You are out of time!");
        $('#correct-answer').html(game.questions[game.currentQuestion].correct_answer);
        game.currentQuestion++;
        game.unansweredQuestions++;
        game.hideQuestion();
        game.showResult();
        if (game.currentQuestion > game.questions.length - 1) {
            game.showScores()
        } else {
            game.startResultTimer()
        }
    },
    showScores: function () {
        $('#score-card').show();
        $('#correct-total').text(game.correctAnswers);
        $('#incorrect-total').text(game.wrongAnswers);
        $('#unanswered-total').text(game.unansweredQuestions);
        game.hideResult();
    },
    hideScores: function () {
        $('#score-card').hide();
    }
}

$(function () {
    game.startGame()
    game.hideTimer()
    game.hideQuestion()
    game.hideResult()
    game.hideScores()
    $("[data-toggle=popover]").popover();
    $('.popover-dismiss').popover({
        trigger: 'focus'
    })
});
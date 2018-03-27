var game = {
  questions: [{}],
  getQuestions: function() {
    url =
      "https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple";
    $.ajax({
      type: "GET",
      url: url,
      success: function(response) {
        game.questions = response.results;
        console.log(JSON.stringify(response.results));
        game.showTimer();
        game.showQuestion();
      }
    });
  },
  imageURL: "",
  getRandomImage: function() {
    imageApiUrl =
      "https://api.giphy.com/v1/gifs/random?api_key=9QlbLuAZPRqqt9iFUGsCDEohAG6hNb6B&tag=video%20game&rating=PG";
    $.ajax({
      type: "GET",
      url: imageApiUrl,
      success: function(response) {
        game.imageURL = response.data.fixed_height_small_url;
        $("#result-random-image").attr("src", game.imageURL);
      }
    });
  },
  currentQuestion: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  unansweredQuestions: 0,
  startButtonDelay: 2000,
  timer: 10,
  intervalID: "",
  resultTimer: 3,
  restartTimer: 5,
  startButtonClickHandler: function() {
    $("#start-button").click(function(e) {
      game.startGame();
    });
  },
  startGame: function() {
    game.hideScores();
    game.hideStartButton();
    game.getQuestions();
    game.correctAnswers = 0;
    game.wrongAnswers = 0;
    game.unansweredQuestions = 0;
    game.currentQuestion = 0;
  },
  hideStartButton: function() {
    $("#start-button").hide(game.startButtonDelay, function() {});
    // $("#start-button").fadeOut("slow", function(){});
  },
  startTimer: function() {
    counter = 0;
    game.updateTimer(game.timer);
    game.intervalID = setInterval(function() {
      counter++;
      if (counter <= game.timer) {
        game.updateTimer(game.timer - counter);
      } else {
        game.stopTimer();
        game.outOfTimeResult();
      }
    }, 1000);
  },
  startRestartTimer: function() {
    counter = 0;
    game.updateTimer(game.restartTimer);
    game.intervalID = setInterval(function() {
      counter++;
      if (counter <= game.restartTimer) {
        game.updateTimer(game.restartTimer - counter);
      } else {
        game.stopTimer();
        game.startGame();
      }
    }, 1000);
  },
  startResultTimer: function() {
    counter = 0;
    game.updateTimer(game.resultTimer);
    game.intervalID = setInterval(function() {
      counter++;
      if (counter <= game.resultTimer) {
        game.updateTimer(game.resultTimer - counter);
      } else {
        game.stopTimer();
        game.showQuestion();
        game.startTimer();
        game.hideResult();
      }
    }, 1000);
  },
  stopTimer: function() {
    clearInterval(game.intervalID);
  },
  updateTimer: function(timerValue) {
    $("#timer").text(timerValue);
  },
  showTimer: function() {
    $("#timer").text(game.timer);
    $("#timer-row").show();
    game.startTimer();
  },
  hideTimer: function() {
    $("#timer-row").hide();
  },
  showQuestion: function() {
    $("#question-card").show();
    $("#question-title").html(game.questions[game.currentQuestion].question);
    game.showChoices();
  },
  hideQuestion: function() {
    $("#question-card").hide();
  },
  showChoices: function() {
    choices = [...game.questions[game.currentQuestion].incorrect_answers];
    choices.push(game.questions[game.currentQuestion].correct_answer);
    choices.sort(() => Math.random() - 0.5);
    $.each(choices, (index, value) => {
      $("#choice" + index).html(value);
    });
    game.choiceClickHandler();
  },

  choiceClickHandler: function() {
    $(".choices")
      .off()
      .on("click", function(e) {
        game.stopTimer();
        choice = $(this).text();
        if (choice == game.questions[game.currentQuestion].correct_answer) {
          game.correctAnswerResult();
        } else if (
          choice != game.questions[game.currentQuestion].correct_answer
        ) {
          game.wrongAnswerResult();
        } else {
        }
      });
  },

  showResult: function() {
    $("#result-card").show();
  },
  hideResult: function() {
    $("#result-card").hide();
  },
  correctAnswerResult: function() {
    $("#result-title").text("Correct!");
    $("#result-text").html('<span id="correct-answer"></span>');
    game.getRandomImage();
    game.currentQuestion++;
    game.correctAnswers++;
    game.hideQuestion();
    game.showResult();
    if (game.currentQuestion >= game.questions.length) {
      game.showScores();
    } else {
      game.startResultTimer();
    }
  },
  wrongAnswerResult: function() {
    $("#result-title").text("Incorrect");
    console.log(game.questions[game.currentQuestion].correct_answer);
    $("#result-text").html(
      'The Correct Answer was: <span id="correct-answer">' +
        game.questions[game.currentQuestion].correct_answer +
        "</span>"
    );
    game.getRandomImage();
    game.currentQuestion++;
    game.wrongAnswers++;
    game.hideQuestion();
    game.showResult();
    if (game.currentQuestion >= game.questions.length) {
      game.showScores();
    } else {
      game.startResultTimer();
    }
  },
  outOfTimeResult: function() {
    $("#result-title").text("You are out of time!");
    $("#result-text").html(
      'The Correct Answer was: <span id="correct-answer">' +
        game.questions[game.currentQuestion].correct_answer +
        "</span>"
    );
    game.getRandomImage();
    game.currentQuestion++;
    game.unansweredQuestions++;
    game.hideQuestion();
    game.showResult();
    if (game.currentQuestion >= game.questions.length) {
      game.showScores();
    } else {
      game.startResultTimer();
    }
  },
  showScores: function() {
    $("#score-card").show();
    $("#correct-total").text(game.correctAnswers);
    $("#incorrect-total").text(game.wrongAnswers);
    $("#unanswered-total").text(game.unansweredQuestions);
    game.hideResult();
    game.startRestartTimer();
  },
  hideScores: function() {
    $("#score-card").hide();
  }
};

$(function() {
  game.startButtonClickHandler();
  game.hideTimer();
  game.hideQuestion();
  game.hideResult();
  game.hideScores();
});

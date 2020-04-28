<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Project: Word game </title>
        <style>
            
            body {
                font-family: Arial, sans-serif;
            }
            form {
                font-size: 1.5em;
            }
            .edition{
            color:blue;
            font-size: 0.8em;
            }
            .scrambled, input, button {
                font-family: monospace;
                font-size: 2em;
            }
            
            /* Hides text, this way it can be used as a substitute text file to store the wordlist in*/
            #wordlist{
                display:none;
            }
            #score{
                  color: rgb(82, 245, 0);
                  
                font-size: 1.6em;
                font-family: monospace;
            }
            #message{
                    color: rgb(250, 100, 0);
                font-size: 1.6em;
                font-family: monospace;
                
            }
            
        </style>
    </head>
    <body>
    
    <h1>Word game!  <span class = "edition ">Animal Edition</span>
        
    </h1>
  
    <div id = "wordlist">
    <!--http://www.manythings.org/vocabulary/lists/a/words.php?f=animals_1-->bird
alligator
bear
bee
bird
cat
chicken
chimpanzee
crocodile
dog
dolphin
fish
fly
fox
giraffe
horse
lion
monkey
panda
pig
rabbit
sheep
snake
spider
tiger
wolf
zebra
    </div>
    <form id="joke-form">
        <label>
            Unscramble these letters to form a word:<Br>
            <span class="scrambled"></span>
            <br>
            <input type="text" size="10">
        </label>
        <button type="submit">Check</button>
        
        <span id = "score" >
        <br>
        <br>
            score: 0
        </span>
        <span id = "message">
            
        </span>
    </form>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script>
    
    var lost = false;
    // Creates a new <audio> element
    var $soundNormal = $("<audio preload=auto>");
    // See: https://www.khanacademy.org/computer-programming/example-playing-sound-on-click/6617772749619200
    $soundNormal.attr("src",
        "https://www.kasandbox.org/programming-sounds/retro/coin.mp3	");
        
    // Creates a new <audio> element
    var $soundLose = $("<audio preload=auto>");
    // See: https://www.khanacademy.org/computer-programming/example-playing-sound-on-click/6617772749619200
    $soundLose.attr("src",
        "https://www.kasandbox.org/programming-sounds/rpg/giant-no.mp3");
        
        
       // Creates a new <audio> element
    var $soundSpecial = $("<audio preload=auto>");
    // See: https://www.khanacademy.org/computer-programming/example-playing-sound-on-click/6617772749619200
    $soundSpecial.attr("src",
        "https://www.kasandbox.org/programming-sounds/retro/laser4.mp3");
        
        
        
    //Loads in word list from hidden html
    //used as a substitute text file
    var wordList = $("#wordlist").text             ().match(/\b(\w+)\b/g);
     
    //Returns a random word from the wordList
    randomWord = function(){
        var len = wordList.length;
        //return random number between 0 and length of wordList
        var randIdx = Math.floor((Math.random() * len));
        var word = wordList[randIdx];
        return word
    }
        
    //Help function to change letters
    //in a string: 
    //http://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
    String.prototype.replaceAt=function       (index, character) 
    {
        return this.substr(0, index) +            character + this.substr(index             +character.length);
    }
    
    //Scrambles a word using Fisher Yates algorithm
    //based on shuffle algorithm here: https://bost.ocks.org/mike/shuffle/
    Scramble = function(word)
    {
        var m = word.length;
    
        var i;
        var t;
    
        // While there remain elements to
        // shuffle
        while(m != 3)
        {
           m--;
            //Pick a remaining element
            i = Math.floor(Math.random()* m);  
            
            //Replace element with last in array (m), where the new string is build from
            
            t = word[i]
            word = word.replaceAt(i, word[m]);
            word = word.replaceAt(m, t)
            
        }
        
        return word;
    };
    
    //Sets a new scrambled word
    //return original word, so we can check
    //if a valid answer is given.
    SetScrambledWord = function ()
    {
    $word =    $("#joke-form").find("[class =scrambled]");
    var newWord = randomWord();
    var scrambledWord = Scramble(newWord);
    $word.text(scrambledWord);
    return newWord
    };
      
    var curWord = SetScrambledWord();

    GetScore = function()
    {
        return parseInt($score = $("#joke-form").find("[id=score]"               ).text().match(/\b(\w+)\b/g)[1] )
    };
    
    SetScore = function(score){
        $("#joke-form").find("[id=score]"               ).html("<br> <br> score: " + score);
    }
    
  var PlaySound = function(score){
      if(score % 10 !== 0)
      {
          $soundNormal[0].play();
      }
      else {
          $soundSpecial[0].play();
      }
  
  };
   
   var WinMessage = function(score)
   {
    
       var message = "You Scored: " + score+ " ,";
       if(score >= 50)
       {
           message += " You're AWESOME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
       }
       else if(score >= 40)
       {
           message += " FANTASTIC JOB"
       }
       else if(score >= 30 )
       {
           message += " WELL DONE!"
       }
       else if(score >= 20)
       {
           message += " You're Great"
       }
       
       else if (score >= 10)
       {
           message += " You're pretty good !"
       }
       else{
           message += " Next time more luck"
       }
       
       if(!lost){
           message = ""
       }
       $("#joke-form").find("[id=message]").html("<br><br>"+ message);   
       
   };
      
    //When the user submits the form
    $("#joke-form").on("submit", function(event){
        event.preventDefault();
        
        
        //Checks that their answer is correct
        //Handles all possible lower- /upper cases, by turning originals both to upper
        //before final check
        $givenAnswer = $(this).find("[type=text]").val();
        $scrambled = $(this).find("[class=scrambled]").text();
        
        $givenAnswer =  $givenAnswer.toUpperCase();
        $correctAnswer = curWord.toUpperCase();
        
        correct = $givenAnswer === $correctAnswer
       
        if(correct)
        {   
            lost = false;
            WinMessage(GetScore());
            SetScore(GetScore()+1)
            curWord = SetScrambledWord();
            $(this).find("[size=10]").val("");        
            //Plays special sounds at                 certain scores
            PlaySound(GetScore())
           
            
        }
        
        else
        {
            lost = true;
            WinMessage(GetScore());
            SetScore(0)
            $soundLose[0].play();
            curWord = SetScrambledWord();
            
            
        }
                
    });         
  
         
    /** JAS SOUND FUNCTION, Special and normal sounds SEPERATED**/
    </script>
    </body>
</html>


// Code for chat mutation observer and respond function from Code Review Stack 
// Exchange question http://codereview.stackexchange.com/q/132979/
var target = document.getElementById("chat");

var obs = new MutationObserver(function(muts) {
    if (muts[0].addedNodes[0].className.indexOf("mine") == -1) {  
        var messages = document.getElementsByClassName("content");
        var lastMessage = messages[messages.length - 1].innerHTML;
       
       if (lastMessage.charAt(0) != ".") {
           respond(lastMessage.slice(1));
       }
    }
});

var config = { attributes: true, childList: true, characterData: true};
obs.observe(target, config);

var sendButton = document.getElementById("sayit-button");
var input = document.getElementById("input");

function sendMessage(message) {
    input.value = message;
    sendButton.click();
    
    /*console.log(message);*/
}

// Levenshtein function from Programming Puzzles and Code Golf Stack Exchange 
// answer http://codegolf.stackexchange.com/a/63754/
function levenshtein(s,t) {
  if(s == t) return 0;
  if(s.length === 0) return t.length;
  if(t.length === 0) return s.length;

  var v0 = Array(t.length+1),
      v1 = Array(t.length+1);

  for(var i=0; i<v0.length; i++) v0[i]=i;
  for(i=0; i<s.length; i++) {
    v1[0]=i+1;
    for(var j=0; j<t.length; j++)
      v1[j+1] = Math.min(v1[j]+1, v0[j+1]+1, v0[j]+(s[i]==t[j]?0:1));
    for(j=0; j<v0.length; j++) v0[j]=v1[j];
  }
  return v1[t.length];
}

// Put your knowledge base here, in format:
// var knowledgeBase = [
//     ["message", "response"],
//     ["message2", "response2"]
// ];
// Note that the messages in there must be lower case, and include only 
// letters, numbers and spaces.
var knowledgeBase = [
    ["put", "your"],
    ["knowledge", "base"],
    ["right", "here"]
];

var threshold = 5;

function neutraliseMessage(msg) { return msg.toLowerCase().replace(/[^a-z0-9 ]/g, ""); }

function pickMessage(msg, data) {
  var neutralisedMessage = neutraliseMessage(msg);
  var possibleAnswers = [];
  for(var i = 0; i < data.length; i++) {
    if(levenshtein(neutralisedMessage, data[i][0]) < threshold) {
      possibleAnswers.push(data[i][1]);
    }
  }
  return possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
}

function respond(msg) {
  sendMessage(pickMessage(msg, knowledgeBase));
}

sendMessage("Hello!");

/**
 * # How to Use
 * 1. Create a knowledge base and put it in the variable `knowledgeBase`.
 * 2. Put the above code in the developer console.
 * Bam done.
 */

/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var builder_cognitiveservices = require("botbuilder-cognitiveservices");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
//var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);

//=========================================================USE TO TEST LOCALLY ON EMULATOR
var storageName = 'ffqnamakertestbotservice'; 
var storageKey = 'qmv/iG+dQ9WalD8PkHyPeyCuA+zYfqWGlr16JMI9jGJiYhK4+U4RYMl+gwvKeuFuvzygNT1gu3LP2VJi8NMLfA==';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, storageName, storageKey);
//=========================================================USE TO TEST LOCALLY ON EMULATOR

var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);

bot.set('storage', tableStorage);

/*
// Recognizer and and Dialog for preview QnAMaker service
var previewRecognizer = new builder_cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: process.env.QnAKnowledgebaseId,
    authKey: process.env.QnAAuthKey || process.env.QnASubscriptionKey
});

var basicQnAMakerPreviewDialog = new builder_cognitiveservices.QnAMakerDialog({
    recognizers: [previewRecognizer],
    defaultMessage: 'No match! Try changing the query terms!',
    qnaThreshold: 0.3
}
);

bot.dialog('basicQnAMakerPreviewDialog', basicQnAMakerPreviewDialog);

// Recognizer and and Dialog for GA QnAMaker service
var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: process.env.QnAKnowledgebaseId,
    authKey: process.env.QnAAuthKey || process.env.QnASubscriptionKey, // Backward compatibility with QnAMaker (Preview)
    endpointHostName: process.env.QnAEndpointHostName
});

var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage: 'No match! Try changing the query terms!',
    qnaThreshold: 0.3
}
);

bot.dialog('basicQnAMakerDialog', basicQnAMakerDialog);

bot.dialog('/', //basicQnAMakerDialog);
    [
        function (session) {
            var qnaKnowledgebaseId = process.env.QnAKnowledgebaseId;
            var qnaAuthKey = process.env.QnAAuthKey || process.env.QnASubscriptionKey;
            var endpointHostName = process.env.QnAEndpointHostName;

            // QnA Subscription Key and KnowledgeBase Id null verification
            if ((qnaAuthKey == null || qnaAuthKey == '') || (qnaKnowledgebaseId == null || qnaKnowledgebaseId == ''))
                session.send('Please set QnAKnowledgebaseId, QnAAuthKey and QnAEndpointHostName (if applicable) in App Settings. Learn how to get them at https://aka.ms/qnaabssetup.');
            else {
                if (endpointHostName == null || endpointHostName == '')
                    // Replace with Preview QnAMakerDialog service
                    session.replaceDialog('basicQnAMakerPreviewDialog');
                else
                    // Replace with GA QnAMakerDialog service
                    session.replaceDialog('basicQnAMakerDialog');
            }
        }
    ]);



// Recognizer and and Dialog for GA QnAMaker service
var qnaRecognizer = new builder_cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: process.env.QnAKnowledgebaseId,
    authKey: process.env.QnAAuthKey || process.env.QnASubscriptionKey, // Backward compatibility with QnAMaker (Preview)
    endpointHostName: process.env.QnAEndpointHostName
});

   
var LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/453c919d-d4b0-4e8d-851a-f953df97205d?subscription-key=433ca45e770c4acabf747038f27dd43b&staging=true&verbose=true&timezoneOffset=-480&q=';      
var luisRecognizer = new builder.LuisRecognizer(LuisModelUrl);

// Setup dialog
var intentsDialog = new builder.IntentDialog({ recognizers: [qnaRecognizer, luisRecognizer] });
bot.dialog('/', intentsDialog);

// QnA Maker
intentsDialog.matches('qna', (session, args, next) => {
    var answerEntity = builder.EntityRecognizer.findEntity(args.entities, 'answer');
    session.send(answerEntity.entity);
});

// LUIS Action Binding
var SampleActions = require('../LuisActionBinding/all');
builder_cognitiveservices.LuisActionBinding.bindToBotDialog(bot, intentsDialog, LuisModelUrl, SampleActions);

// Default message
intentsDialog.onDefault(session => session.send('Sorry, I didn\'t understand that.'));
https://github.com/Microsoft/BotBuilder-CognitiveServices/blob/master/Node/samples/QnAMaker/QnAWithLUIS/app.js
*/

//=========================================================
// Recognizers
//=========================================================

/*var qnaRecognizer = new builder_cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: process.env.QnAKnowledgebaseId,
    authKey: process.env.QnAAuthKey || process.env.QnASubscriptionKey, // Backward compatibility with QnAMaker (Preview)
    endpointHostName: process.env.QnAEndpointHostName,
    top: 4});


var luisAppId = '453c919d-d4b0-4e8d-851a-f953df97205d';
var luisAPIKey = '433ca45e770c4acabf747038f27dd43b';
var luisAPIHostName = 'westus.api.cognitive.microsoft.com';
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

var luisRecognizer = new builder.LuisRecognizer(LuisModelUrl);    
//=========================================================USE TO TEST LOCALLY ON EMULATOR



//=========================================================
// Bot Dialogs
//=========================================================
var intents = new builder.IntentDialog({ recognizers: [luisRecognizer, qnaRecognizer] });

bot.dialog('/', intents);
intents.matches('luisIntent1', builder.DialogAction.send('Inside LUIS Intent 1.'));

intents.matches('luisIntent2', builder.DialogAction.send('Inside LUIS Intent 2.'));

intents.matches('qna', [
    function (session, args, next) {
        var answerEntity = builder.EntityRecognizer.findEntity(args.entities, 'answer');
        session.send(answerEntity.entity);
    }
]);



intents.onDefault([
    function(session){
        session.send('Sorry, I cant help you with that. Let me connect you to a human.');
    }
]);





    */

//var model='https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/453c919d-d4b0-4e8d-851a-f953df97205d?subscription-key=433ca45e770c4acabf747038f27dd43b&verbose=true&timezoneOffset=0&q=';
//var luisRecognizer = new builder.LuisRecognizer(model);

//=========================================================USE TO TEST LOCALLY ON EMULATOR
var qnaknowledgeBaseId = 'e299db87-db1e-4bb3-bce4-2c0f99cd8f2d';
var qnaauthKey = '42826224-b8c3-4344-abb1-e6521c9cc254';
var qnaendpointHostName = 'https://ff-qnamaker-test.azurewebsites.net/qnamaker';
var qnaRecognizer = new builder_cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: qnaknowledgeBaseId,
    authKey: qnaauthKey, 
    endpointHostName: qnaendpointHostName,
    top: 4});


var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
    recognizers: [qnaRecognizer],
    defaultMessage: 'Sorry, I cant help you with that. Let me connect you to an IT representative',
    qnaThreshold: 0.3}
    );
    
    // override
    basicQnAMakerDialog.respondFromQnAMakerResult = function(session, qnaMakerResult){
        // Save the question
        var question = session.message.text;
        session.conversationData.userQuestion = question;
    
        // boolean to check if the result is formatted for a card
        var isCardFormat = qnaMakerResult.answers[0].answer.includes(';');
        var isVPNQS = qnaMakerResult.answers[0].answer.includes('VPN');

        if(!isCardFormat && !isVPNQS){
            session.send(qnaMakerResult.answers[0].answer);
        }

        else if(isCardFormat && qnaMakerResult.answers && qnaMakerResult.score >= 0.5){
            var qnaAnswer = qnaMakerResult.answers[0].answer;
            
                    var qnaAnswerData = qnaAnswer.split(';');
                    var title = qnaAnswerData[0];
                    var description = qnaAnswerData[1];
                    var url = qnaAnswerData[2];
                    var imageURL = qnaAnswerData[3];
                    var urlMessage = 'Open ' + title;
                    var msg = new builder.Message(session)
                    msg.attachments([
                        new builder.HeroCard(session)
                        .title(title)
                        .subtitle(description)
                        .images([builder.CardImage.create(session, imageURL)])
                        .buttons([
                            builder.CardAction.openUrl(session, url, urlMessage)
                        ])
                    ]);
            }

            else if(isVPNQS && qnaMakerResult.answers && qnaMakerResult.score >= 0.5){ 
                var msg = new builder.Message(session)
                msg.attachments([
                    new builder.VideoCard(session)
                    .title('Troubleshoot VPN Issues')
                    .subtitle('Watch this video to fix your VPN Issues')
                    .media([builder.CardMedia.create(session, 'https://www.youtube.com/watch?v=sF4cLMggIEY')])
                    .buttons([
                        builder.CardAction.openUrl(session, url, 'Go to Video')
                    ])
                ]);
            }
            session.send(msg).endDialog();  
        }

    bot.dialog('skypeMeetingConfirm',[
        function(session,args,next){
            session.beginDialog('getSkypeMeetingType');
        },
        function(session, results, next){
            if(results.response.entity.includes('Yes')){
                session.endConversation('Great! Follow these steps to join the meeting: \n\n1. Locate the Skype Room Table \n2.	Next, find your scheduled meeting on the screen.\n3.	Click the JOIN button \n4.	That’s it! You should now be connected.');  
            }else{
                session.endConversation('Unfortunately, the meeting was not setup with Skype and cannot be used with Skype at this time.');  
            }
                          
        },
    ]).triggerAction({
        matches: /skype/i
    });
 
    bot.dialog('getSkypeMeetingType', [
        function(session, args, next){
            builder.Prompts.choice(session, 'Was the meeting created through Outlook with the Skype meeting option checked?', 'Yes|No', { listStyle: builder.ListStyle.button });
        },
        function(session, results, next){
            console.log(session.dialogStack());
            const decision = results.response;
            session.endDialogWithResult({response: decision});
        },
    ]);

bot.dialog('/', basicQnAMakerDialog);


//bot.dialog('/', basicQnAMakerDialog);

/*bot.dialog('dialog-IT-Application-Skype-CreateMeeting', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);*/
$(document).ready(function(){

    var APIurl = 'https://andruxnet-random-famous-quotes.p.mashape.com/cat=general';
    var headers = { 'X-Mashape-Key': 'nDegI0wJR6mshIjYx6LMEfYdXB3Lp1oa3FRjsnfnpNhjfD2Xjb', 
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                    };
    var getQuote = function(){
        $.ajax({
            type: 'GET',
            url: APIurl,
            headers: headers,
            success: function(response){
                response= JSON.parse(response)
                processQuotes(response);
            },
            error: function(err){
                console.log("An error occured", err);
            }   
        });
    };
    // Process and append Quotes
    var processQuotes= function(param){
        var newQuote= '<div><strong>' + param.quote + '</strong><br><p>' + param.author + '</p>';
        $('.quotes').html(newQuote);
    };
    //  Event listener for click Add More button to add more quotes manually
    $('.add_more').click(function(){
        getQuote();
    });
});
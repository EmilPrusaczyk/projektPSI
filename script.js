$(document).ready(function(){
    $('#ajax-content').empty().append("<div id='loading'>Loading</div>");

    $.ajax({url: "glowna.html", success: function (html) {
        $("#ajax-content").empty().append(html);
    }});

    $(".navbar a").click(function(){
        $('#ajax-content').empty().append("<div id='loading'><img src='images/loading.gif'></div>");
        $(".navbar a").removeClass('navbar-current');
        $(this).addClass('navbar-current');

        $.ajax({url: this.href, success: function (html) {
            $("#ajax-content").empty().append(html);

            if($(".navbar a.navbar-current").html() == "Dyskografia") {
                discographyInit();
            } else if($(".navbar a.navbar-current").html() == "Galeria") {
                galleryInit();

                $('.add-comment-button').click(function (event) {
                    $(this).hide();
                    $(this).closest('.comments').children('.comment-form').show();
                });

                $(".comment-form").submit(function (event) {
                    event.preventDefault();
                    var comments = $(this).closest('.comments');
                    var values = $(this).serializeArray();
                    var valuesObj = {};
                    $(values).each(function (i, field) {
                        valuesObj[field.name] = field.value;
                    });

                    var commentString = "<li>" + valuesObj['comment-text'] + "<span class='comment-author'> ~" + valuesObj['comment-name'] + "</span>" + "</li>";

                    comments.children('.comment-list').append(commentString);
                    $(this).find("input[type=text]").val("");

                    var imageID = $(this).closest('.gallery-image').children('.album-id').html();
                    var commentBlock = localStorage.getItem(imageID);
                    if(commentBlock != null) {
                        commentBlock = commentBlock + commentString;
                    } else {
                        commentBlock = commentString;
                    }
                    localStorage.setItem(imageID, commentBlock);
                });
            }
        }});
        return false;
    });

    $(window).scroll(function () {
        if($(".navbar a.navbar-current").html() == "Dyskografia") {
            if($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
                addAlbum();
            }
        }

    });
});

function galleryInit() {
    $('.gallery-image').each(function (i, image) {
       var imageID = $(image).children('.album-id').html();
       var commentBlock = localStorage.getItem(imageID);
       $(image).children('.comments').children('.comment-list').append(commentBlock);
    });
}

function discographyInit() {
    var no_scrollbar_workaround = setInterval(function checkVariable() {
        if($(window).height() >= $(document).height()) {
            addAlbum();
        } else {
            clearInterval(no_scrollbar_workaround);
        }
    }, 100);
}

function addAlbum() {
    var lastAlbumID = 0;
    if($(".album-list li").length > 0) {
        lastAlbumID = $(".album-list li:last-child .album .album-id").html();
    }
    if(parseInt(lastAlbumID) == 6) {
        return false;
    }
    var appendReady = true;

    $.getJSON("albums.json", function (data) {
        $.each(data, function (i, item) {
            if(parseInt(item.id) == parseInt(lastAlbumID)+1 && appendReady) {
                appendReady = false;

                $(".album-list").append("<li><div class=\"album\"><img src=\"" + item.cover + "\" class='album-cover'><div class=\"album-id\">" + item.id + "</div><div class=\"album-description\"><p class=\"album-name\">" + item.name + "</p><p class=\"album-release\">Rok wydania: " + item.releaseYear + "</p><p class=\"album-description-text\">" + item.description + "</p><a target=\"_blank\" href=\"" + item.RYMlink + "\"><img src=\"images/sonemic.png\" class=\"icon32by32\"></a><a target=\"_blank\" href=\"" + item.discogsLink + "\"><img src=\"images/discogs-white.png\" class=\"icon32by32\"></a></div></div></li>").append(function () {
                    appendReady = true;
                });
            }
        });
    });
}


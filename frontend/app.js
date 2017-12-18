// Tragen Sie hier ihren Stud.IP Namen ein!
const YourName = '';

// JQuery soll warten, bis die HTML-Seite vollständig geladen wurde, um Fehler zu vermeiden.
$(document).ready(function () {
    // Das Herz-Icon als Bilddatei
    const HeartIconSource = 'https://i.imgur.com/MXgr4Xl.png';

    /**
    Wir erstellen eine leere Variable `posts` und machen einen GET-Request auf die Route `/posts` um alle Posts
    herunter zu laden. Sobald die Response kommt speichern wir die Posts in unsere bisher leere Variable und rufen die
    Funktion `renderPosts()` auf und übergeben die `posts.
    **/
    let posts;
    $.getJSON(`https://${YourName}.now.sh/posts`, function (data) {
        posts = data;
        renderPosts(posts);
    });

    /**
    Dieser Aufruf kümmert sich um den Upload neuer Posts. Es wird auf einen Klick auf den "Absenden" Button oben gewartet.
    Sobald dieser gedrückt wird, wird der Username, der Titel sowie die Bilddatei in Variablen gespeichert.
    Alle werden dann in ein neues Formular gepackt. Dies braucht man um Daten, die kein Text sind in einem Request zu senden,
    in unserem Fall die Bilddatei.
    Zu guter Letzt setzen wir dann einen POST-Request ab und senden das Formular (Variable `data`).
    Sobald der Response erfolgreich ankommt laden wir automatisiert die Seite neu (location.reload()).
    **/
    $("#absenden").click(function () {
        let username = $("#username").val();
        let titel = $("#titel").val();
        let bild = $('#bild')[0].files[0];

        if (username && titel && bild) {
            let data = new FormData;
            data.append('author', username);
            data.append('title', titel);
            data.append('image', bild);

            $.ajax({
                url : `https://${YourName}.now.sh/upload`,
                type: 'POST',
                contentType: false,
                processData: false,
                data: data,
            }).done(function (res) {
                location.reload();
            });

            $("#absenden").attr('disabled', true);
        }
    });

    /**
    Hier wird gewartet, bis der User auf ein Herz-Icon an einem Post klickt. Passiert dies so wird die Post-ID sowie der
    Username des Nutzers in Variablen zwischengespeichert. Als nächstes wird mittels einer Schleife über alle Posts, derjenige
    Post gefunden, der geklickt wurde. Falls außerdem der User, diesen noch nicht geliked hatte (!post["liked"].includes(username))
    so wird ein PATCH-Request gesendet. Ist im Response die Variable (`liked` === true) so wird der Counter der Likes im Frontend
    um eins erhöht sowie das Herz rot eingefärbt (bzw. nicht mehr grau)
    **/
    $('body').on('click', '.likes img', function (e) {
        let target = $(e.target);
        let postId = $(target).data('id');
        let username = $('#username').val();

        posts.forEach(function (post) {
            if (post["id"] === postId && !post["liked"].includes(username)) {
                $.ajax({
                    url : `https://${YourName}.now.sh/like`,
                    type: 'PATCH',
                    contentType: 'application/x-www-form-urlencoded',
                    data: {
                        "username": username,
                        "id": postId,
                    },
                }).done(function (res) {
                    if (res["liked"] === true) {
                        let currentText = $(target).next().text();
                        $(target).next().text(`${parseInt(currentText.charAt(0)) + 1} Likes`);
                        $(target).css('filter', 'grayscale(0)');
                    }
                });

                post["liked"].push(username);
            }
        });
    });

    /**
    Diese Funktion erhält ein Array an Posts und läuft mit einer Schleife über jedes und erstellt mit der Funktion
    `buildPostMarkup()`, die Sie bereits kennen, das HTML-Markup um es dann in die Seite einzfügen.
    **/
    function renderPosts(posts) {
        let username = $("#username").val();
        let uploadContainer = $('#upload');

        posts.forEach(function (post) {
            let markup = buildPostMarkup(
                post["author"],
                post["image"],
                post["id"],
                post["liked"].length,
                post["liked"].includes(username),
                post["title"],
            );

            uploadContainer.after(markup);
        });
    }

    /**
    Diese Funktion erhält die Infos um einen Post in HTML zu bauen.
    Neu hinzu gekommen ist die Möglichkeit zu sagen, ob der User den Post bereits geliked hat. (Parameter: `alreadyLiked`)
    Auf Basis dessen wird das Herz-Icon entweder grau oder rot.
    **/
    function buildPostMarkup(author, imageSource, postId, likeAmount, alreadyLiked, titleText) {
        let heartIconGrayscale = 1;
        if (alreadyLiked) {
            heartIconGrayscale = 0;
        }

        return (
            `
          <li>
            <p>${author}</p>
            <img src="${imageSource}">
            <div class="likes">
              <img src="${HeartIconSource}" data-id="${postId}" style="filter: grayscale(${heartIconGrayscale});">
              <span>${likeAmount} Likes</span>
            </div>
            <p>${titleText}</p>
          </li>
          `
        );
    }
});

$(document).ready(function () {
    let posts = [
        {
            "id": "d92jfi",
            "image": "http://localhost:3000/uploads/c568ab0c7e90c3fc122936fef0d4d489",
            "title": "Das Schloss zu Biebrich",
            "author": "loehnertz",
            "liked": ["tester1", "tester2", "etawawd"]
        },
        {
            "id": "2ecji9",
            "image": "https://lh3.googleusercontent.com/p/AF1QipMbAwY9MBHgd_zAzO97Dd4R0fYrVicNIpaswOow=s1600-w1200",
            "title": "Das Kurhaus",
            "author": "loehnertz",
            "liked": ["tester1", "tester2"]
        },
        {
            "id": "28wda7z",
            "image": "https://lh3.googleusercontent.com/p/AF1QipMbAwY9MBHgd_zAzO97Dd4R0fYrVicNIpaswOow=s1600-w1200",
            "title": "Der Neroberg",
            "author": "loehnertz",
            "liked": ["tester1", "tester2", "etawawd"]
        },
    ];

    const HeartIconSource = 'https://i.imgur.com/MXgr4Xl.png';

    let imageContainer = $('#image-container');

    posts.forEach(function (post) {
        let author = post.author;
        let imageSource = post.image;
        let titleText = post.title;
        let postId = post.id;
        let likeAmount = post.liked.length;

        let markup =
            `
              <li>
                <p>${author}</p>
                <img src="${imageSource}">
                <div class="likes">
                  <img src="${HeartIconSource}" data-id="${postId}">
                  <span>${likeAmount} Likes</span>
                </div>
                <p>${titleText}</p>
              </li>
            `;

        $(imageContainer).append(markup);
    });

    $('#absenden').click(function () {
        let username = $('#username').val();
        let title = $('#titel').val();
        let imageSource = URL.createObjectURL($('#bild')[0].files[0]);
        let postId = generateRandomId();

        let markup = buildPostMarkup(username, imageSource, postId, 0, title);
        $('#upload').after(markup);
    });

    function generateRandomId() {
        return Math.random().toString(36).slice(3);
    }

    function buildPostMarkup(author, imageSource, postId, likeAmount, titleText) {
        return (
            `
          <li>
            <p>${author}</p>
            <img src="${imageSource}">
            <div class="likes">
              <img src="${HeartIconSource}" data-id="${postId}">
              <span>${likeAmount} Likes</span>
            </div>
            <p>${titleText}</p>
          </li>
          `
        );
    }
});

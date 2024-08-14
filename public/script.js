document.getElementById('searchButton').addEventListener('click', async () => {
    const topic = document.getElementById('topic').value;
    if (topic) {
        const response = await fetch(`/api/tweets?topic=${encodeURIComponent(topic)}`);
        const tweets = await response.json();
        const tweetContainer = document.getElementById('tweets');
        tweetContainer.innerHTML = '';

        if (tweets.length > 0) {
            tweets.forEach(tweet => {
                const tweetElement = document.createElement('p');
                tweetElement.textContent = tweet;
                tweetContainer.appendChild(tweetElement);
            });
        } else {
            tweetContainer.textContent = 'No tweets found for this topic.';
        }
    }
});

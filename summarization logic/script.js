// Function to summarize the input document
function summarize() {
    // Get input text
    const inputText = document.getElementById('input-text').value;

    // Perform text summarization using TextRank algorithm
    const summarizedText = textRankSummarize(inputText);

    // Update summary text in the HTML
    document.getElementById('summary').innerText = summarizedText;
}

// TextRank algorithm for summarization
function textRankSummarize(text) {
    // Split text into sentences
    const sentences = text.split(/[.?!]/g);

    // Remove empty sentences
    const cleanSentences = sentences.filter(sentence => sentence.trim() !== '');

    // Calculate word frequency for each sentence
    const wordFrequencies = cleanSentences.map(sentence => {
        const words = sentence.trim().split(/\s+/g);
        const wordFrequency = {};
        words.forEach(word => {
            if (!wordFrequency[word]) {
                wordFrequency[word] = 0;
            }
            wordFrequency[word]++;
        });
        return wordFrequency;
    });

    // Create graph of sentences
    const graph = {};
    cleanSentences.forEach((sentence, i) => {
        graph[i] = [];
        cleanSentences.forEach((otherSentence, j) => {
            if (i !== j) {
                const commonWords = Object.keys(wordFrequencies[i]).filter(word => wordFrequencies[j][word]);
                const similarity = commonWords.length / (Math.log(Object.keys(wordFrequencies[i]).length) + Math.log(Object.keys(wordFrequencies[j]).length));
                if (similarity > 0) {
                    graph[i].push(j);
                }
            }
        });
    });

    // Perform PageRank on the graph
    const d = 0.85;
    const maxIter = 100;
    let scores = Array(cleanSentences.length).fill(1 / cleanSentences.length);
    for (let iter = 0; iter < maxIter; iter++) {
        const newScores = Array(cleanSentences.length).fill(0);
        for (let i = 0; i < cleanSentences.length; i++) {
            for (const j of graph[i]) {
                newScores[j] += scores[i] / graph[i].length;
            }
        }
        for (let i = 0; i < cleanSentences.length; i++) {
            newScores[i] = (1 - d) + d * newScores[i];
        }
        scores = newScores;
    }

    // Sort sentences based on PageRank scores
    const rankedSentences = cleanSentences.map((sentence, i) => {
        return { sentence, score: scores[i] };
    }).sort((a, b) => b.score - a.score);

    // Select the top sentences for summary
    const numSentences = Math.min(3, rankedSentences.length); // You can adjust the number of sentences in the summary
    const summarySentences = rankedSentences.slice(0, numSentences).map(sentence => sentence.sentence);

    // Join summary sentences into a summarized text
    const summarizedText = summarySentences.join('. ');

    return summarizedText;
}
// Function to summarize the input document
function summarize() {
    // Get input text
    const inputText = document.getElementById('input-text').value;

    // Perform text summarization using TextRank algorithm
    const summarizedText = textRankSummarize(inputText);

    // Update summary text in the HTML
    document.getElementById('summary').innerText = summarizedText;
}

// Function to copy summarized text to clipboard
function copySummary() {
    // Get summarized text
    const summarizedText = document.getElementById('summary').innerText;

    // Create a temporary textarea element to copy text to clipboard
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = summarizedText;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);

    // Show copied message
    alert('Summary copied to clipboard!');
}

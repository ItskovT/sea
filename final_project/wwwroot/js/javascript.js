async function getImage() {
    const title = document.getElementById("title").value;

    const prompt = {
        "CourseTitle": title
    }

    const url = " https://localhost:7036/" + "api/GPT/Dalle"
    const params = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(prompt)
    }

    const response = await fetch(url, params);
    if (response.ok) {
        const data = await response.json();
        const image = document.getElementById("generatedImage");
        image.setAttribute("src", data);

    } else {
        console.log(errors);
    }
}

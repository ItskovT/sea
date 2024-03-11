async function getActivity() {
    const response = await fetch("https://localhost:7036/api/Board");
    const data = await response.json();
    const activity = document.getElementById("activity");
    activity.innerHTML = data.activity;
};


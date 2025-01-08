const baseUrl = "https://cdn.contentful.com/spaces/";

const SPACE_ID = localStorage.getItem("space_id");
const ACCESS_TOKEN = localStorage.getItem("access_token");


const apiURL = `${baseUrl}${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}&content_type=artist&include=3`;

const fetchData = async () => {
  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`HTTP-fel! Statuskod: ${response.status}`);
    }

    const data = await response.json();

   
    console.log("API-svar:", data);

   
    const postContainer = document.getElementById("posts-container");

    if (!postContainer) {
      throw new Error(
        'Elementet med id "posts-container" hittades inte i DOM.'
      );
    }

    const postHTML = data.items
      .map((artist) => {
        if (!artist.fields) {
          console.error("Artist saknar fält:", artist);
          return "";
        }

        const genre = data.includes.Entry.find(
          (entry) => entry.sys.id === artist.fields.genre?.sys.id
        );
        const stage = data.includes.Entry.find(
          (entry) => entry.sys.id === artist.fields.stage?.sys.id
        );
        const day = data.includes.Entry.find(
          (entry) => entry.sys.id === artist.fields.day?.sys.id
        );

        const dayName = day ? day.fields.description : "Ingen dag";

        return `
                <div class="artist-card">
                    <h3>${artist.fields.name}</h3>
                    <p><strong>Genre:</strong> ${
                      genre ? genre.fields.name : "Ingen genre"
                    }</p>
                    <p><strong>Scen:</strong> ${
                      stage ? stage.fields.name : "Ingen scen"
                    }</p>
                    <p><strong>Dag:</strong> ${dayName}</p>
                    <p>${artist.fields.description}</p>
                </div>
            `;
      })
      .join("");

    postContainer.classList.add("artist-grid");

    postContainer.innerHTML = postHTML;
  } catch (error) {
    console.error("Ett fel inträffade vid hämtning av data:", error);
  }
};

fetchData();

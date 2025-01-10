const baseUrl = "https://cdn.contentful.com/spaces/";

const SPACE_ID = localStorage.getItem("space_id");
const ACCESS_TOKEN = localStorage.getItem("access_token");

const apiURL = `${baseUrl}${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}&content_type=stage&include=3`;

const stageImages = {
  "3vgvxJa81kEiQhoRtmM6hp": "images/skyline.jpg",
  "7IKJVj6WWkyJD92osR4ptQ": "images/baseline.jpg",
  "5i73EMnabwIIpziUEUDEnB": "images/sunset.jpg",
  "44HfV7F7WPrMWNMxgmPDYg": "images/echo.jpg",
};

const fetchStages = async () => {
  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`HTTP-fel! Statuskod: ${response.status}`);
    }

    const data = await response.json();

    console.log("API-svar för scener:", data);

    const stageContainer = document.getElementById("stages-container");

    if (!stageContainer) {
      throw new Error(
        'Elementet med id "stages-container" hittades inte i DOM.'
      );
    }

    const stageHTML = data.items
      .map((stage) => {
        if (!stage.fields) {
          console.error("Scen saknar fält:", stage);
          return "";
        }

        const imagePath = stageImages[stage.sys.id] || "images/default.jpg";

        return `
                <div class="stage-card">
                    <h3>${stage.fields.name}</h3>
                    <p>${stage.fields.description}</p>
                    <img src="${imagePath}" alt="${stage.fields.name}" />
                </div>
            `;
      })
      .join("");

    stageContainer.innerHTML = stageHTML;
  } catch (error) {
    console.error("Ett fel inträffade vid hämtning av scener:", error);
  }
};

fetchStages();

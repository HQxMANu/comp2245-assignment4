document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search-field").value.trim().toLowerCase();
  const resultDiv = document.getElementById("result");

  // Fetch the superheroes list from PHP
  fetch("superheroes.php")
      .then((response) => {
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
          return response.text();
      })
      .then((data) => {
          // Parse the list of superheroes from the response
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, "text/html");
          const superheroItems = Array.from(doc.querySelectorAll("li"));

          // If the query is empty, display the original list
          if (query === "") {
              resultDiv.innerHTML = `<ul>${superheroItems.map(item => `<li>${item.textContent}</li>`).join("")}</ul>`;
              return;
          }

          // Search for the superhero by name or alias
          fetch("superheroes.php?json=true") 
              .then((response) => response.json())
              .then((superheroes) => {
                  const superhero = superheroes.find((hero) =>
                      hero.name.toLowerCase() === query || hero.alias.toLowerCase() === query
                  );

                  if (superhero) {
                      resultDiv.innerHTML = `
                          <h4>${superhero.name}</h4>
                          <h3>Alias: ${superhero.alias}</h3>
                          <p>${superhero.biography}</p>
                      `;
                  } else {
                      resultDiv.innerHTML = `<p>Superhero not found</p>`;
                  }
              })
              .catch((error) => {
                  resultDiv.innerHTML = `<p>Error fetching superhero details: ${error.message}</p>`;
              });
      })
      .catch((error) => {
          resultDiv.innerHTML = `<p>Error fetching superheroes: ${error.message}</p>`;
      });
});

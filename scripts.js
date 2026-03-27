function loadRecipe(recipeId) {
    const pageMap = {
        1: "spaghetti.html",
        2: "sinigangNaBangus.html",
        3: "porkAdobo.html",
        4: "pancitBihon.html",
        5: "tinola.html",
        6: "beefCaldereta.html",
        7: "ginisangMunggo.html",
        8: "karekare.html",
        9: "chickenSotanghon.html",
        10: "pininyahangManok.html",
        11: "chickenAdobo.html",
        12: "kinamatisangManok.html",
        13: "porkNilaga.html",
        14: "pataHumba.html",
        15: "porkCaldereta.html",
        16: "bicolExpress.html",
        17: "sarciado.html",
        18: "paksiw.html",
        19: "ukoyDulong.html",
        20: "misuaSardines.html",
        21: "palabok.html"
    };

    const targetPage = pageMap[recipeId];
    if (targetPage) {
        window.location.href = targetPage;
    } else {
        console.error("Recipe page not found for ID:", recipeId);
    }
}

const sidebars = document.querySelectorAll('.side-recipes');
const container = document.getElementById('recipe-container');
window.addEventListener('scroll', () => {
    const containerRect = container.getBoundingClientRect();
    sidebars.forEach(sidebar => {
        if (containerRect.bottom <= window.innerHeight + 20) {
            sidebar.style.position = 'absolute';
            sidebar.style.top = (container.scrollHeight - sidebar.offsetHeight - 20) + 'px';
        } else {
            sidebar.style.position = 'fixed';
            sidebar.style.top = '100px';
        }
    });
});

function moveSlide(buttonElement, direction) {

    const container = buttonElement.closest('.carousel-container');

    const track = container.querySelector('.carousel-track');
    const cards = track.querySelectorAll('.recipe-card');
    const cardWidth = cards[0].offsetWidth + 25;


    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(${-direction * cardWidth}px)`;

    
    setTimeout(() => {
        track.style.transition = "none";        
        if (direction === 1) {
           
            track.appendChild(cards[0]);
        } else {           
            track.prepend(cards[cards.length - 1]);
        }
        
       
        track.style.transform = `translateX(0)`;
    }, 500)
}


document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('recipe-search');
    const searchResults = document.getElementById('search-results');
    

    if (!searchInput || !searchResults) return;

    let highlightedIndex = -1;


    function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }


    function filterRecipes(query) {
        const trimmedQuery = query.trim().toLowerCase();
        
        if (!trimmedQuery) {
            searchResults.classList.remove('active');
            return;
        }


        const filtered = recipes.filter(recipe => {
    const titleMatch = recipe.title.toLowerCase().includes(trimmedQuery);

    const categoryValue = Array.isArray(recipe.category) 
        ? recipe.category.join(' ') 
        : recipe.category;

    const categoryMatch = categoryValue.toLowerCase().includes(trimmedQuery);

    return titleMatch || categoryMatch;
});

        if (filtered.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    No recipes found for "${query}"
                </div>
            `;
        } else {
            searchResults.innerHTML = filtered.map((recipe, index) => `
                <div class="search-result-item" data-id="${recipe.id}">
                    <div class="result-icon"><img src="${recipe.icon}" class="recipe-thumb" alt="${recipe.title}"></div>
                    <div class="result-info">
                        <div class="result-title">${highlightMatch(recipe.title, query)}</div>
                        <div class="result-meta">
                            <span>⏱ ${recipe.cookTime}</span>
                            <span>📊 ${recipe.difficulty}</span>
                            <span>🏷 ${recipe.category}</span>
                        </div>
                    </div>
                </div>
            `).join('') + `
                <div class="search-hint">
                    Press ↑↓ to navigate, Enter to select, Esc to close
                </div>
            `;
        }

        searchResults.classList.add('active');
        highlightedIndex = -1;
    }


    searchInput.addEventListener('input', (e) => {
        filterRecipes(e.target.value);
    });


    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            filterRecipes(searchInput.value);
        }
    });


    searchInput.addEventListener('keydown', (e) => {
        const items = searchResults.querySelectorAll('.search-result-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
            updateHighlight(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            highlightedIndex = Math.max(highlightedIndex - 1, 0);
            updateHighlight(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0 && items[highlightedIndex]) {
                loadRecipe(items[highlightedIndex].dataset.id);
            }
        } else if (e.key === 'Escape') {
            searchResults.classList.remove('active');
            searchInput.blur();
        }
    });

    function updateHighlight(items) {
        items.forEach((item, index) => {
            item.classList.toggle('highlighted', index === highlightedIndex);
        });
        if (items[highlightedIndex]) {
            items[highlightedIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    searchResults.addEventListener('click', (e) => {
        const item = e.target.closest('.search-result-item');
        if (item) {
            loadRecipe(item.dataset.id);
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('active');
        }
    });


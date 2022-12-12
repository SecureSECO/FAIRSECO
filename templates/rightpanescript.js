let activeTab = document.querySelector(".RightPaneNav__Tab--Active");
document.querySelector("." + activeTab.dataset.linkedClass).style.display = "block";

function clickTab(element){
    if (element === activeTab) {
        return;
    }

    activeTab.classList.remove("RightPaneNav__Tab--Active");
    element.classList.add("RightPaneNav__Tab--Active");

    const activePage = document.querySelector("." + activeTab.dataset.linkedClass);
    activePage.style.display = "none";
    const pageToOpen = document.querySelector("." + element.dataset.linkedClass);
    pageToOpen.style.display = "block";

    activeTab = element;
}
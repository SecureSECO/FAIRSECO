let activeTab = document.querySelector(".RightPaneNav__Tab--Active");
document.querySelector("." + activeTab.dataset.linkedClass).style.display = "block";

function clickTab(element){
    if (element === activeTab) {
        return;
    }

    // activeTab = document.querySelector(".RightPaneNav__Tab--Active");
    activeTab.classList.remove("RightPaneNav__Tab--Active");
    element.classList.add("RightPaneNav__Tab--Active");

    const activePage = document.getElementsByClassName(activeTab.dataset.linkedClass)[0];
    activePage.style.display = "none";
    const pageToOpen = document.querySelector("." + element.dataset.linkedClass);
    pageToOpen.style.display = "block";

    activeTab = element;
}
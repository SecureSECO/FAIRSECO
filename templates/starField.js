'use strict'
class link {
    source; // string
    target; // string
    constructor(source, target) {
        this.source = source;
        this.target = target;
    }
}

class node {
    name; // string
    id; // int -- 0 = "Philosophy" 1 = "Art" 2 ="History" 3 = "Economics" 4 = "Geography" 5 = "Psychology"
        //        6 = "Sociology" 7 ="Biology" 8 = "Chemistry" 9 = "Geology" 10 = "Physics" 11 = "Mathematics"
        //        12 = "Computer science" 13 = "Business" 14 = "Engineering" 15 = "Environmental science" 16 = "Medicine" 17 = "Political science" 18 = "Materials science" 19... = [papers]
    size; // int

    constructor(name, id, size) {
        this.name = name;
        this.id = id;
        this.size = size;
    }
}

class starField {
    nodes; // [node]
    links; // [link]
    fieldIndexMap; // Map<string, int>

    constructor(citations) {
        let nodes = [];
        let links = [];
        let fieldIndexMap = new Map();
        for (let i = 0; i < citations.uniqueFields.length; i++) {
            nodes.push(new node(citations.uniqueFields[i], i, 30));
            fieldIndexMap.set(citations.uniqueFields[i], i);
        }
        for (let i = 0; i < citations.papers.length; i++) {
            nodes.push(new node("", i + citations.uniqueFields.length, 6 + (citations.papers[i].numberOfCitations / citations.highestCitations) * 6));
            citations.papers[i].fields.forEach(field => {
                links.push(new link(i + citations.uniqueFields.length, fieldIndexMap.get(field)));
            });
        }
        this.nodes = nodes;
        this.links = links;
        this.fieldIndexMap = fieldIndexMap;
    }

}

function renderStarField() {
    var input = { "papers": [{ "title": "Simulating Lagrangian Subgrid‐Scale Dispersion on Neutral Surfaces in the Ocean", "year": 2021, "doi": "10.1029/2021ms002850", "pmid": "35860619", "pmcid": "9285416", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science", "Physics"], "discipline": "Applied Sciences", "journal": "Journal of Advances in Modeling Earth Systems", "url": "https://dspace.library.uu.nl/bitstream/handle/1874/417874/J_Adv_Model_Earth_Syst_2022_Reijnders_Simulating_Lagrangian_Subgrid_Scale_Dispersion_on_Neutral_Surfaces_in_the_Ocean.pdf?sequence=1&isAllowed=y", "numberOfCitations": 2 }, { "title": "Evaluation of 1D and 3D simulations with CICE: sea ice thermodynamics and dynamics during the SHEBA expedition.", "year": 2020, "doi": "", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "", "url": "https://www.semanticscholar.org/paper/4f96364f446149e1240f98e1193876da94e9accf", "numberOfCitations": 0 }, { "title": "Deep learning for Lagrangian drift simulation at the sea surface", "year": 2022, "doi": "10.48550/arxiv.2211.09818", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Computer science"], "discipline": "Formal Sciences", "journal": "ArXiv", "url": "https://www.semanticscholar.org/paper/cb65317d1102dcf29387dcaa2cecb204819cc0c7", "numberOfCitations": 0 }, { "title": "Effects of oceanography on North Pacific armorhead recruitment in the Emperor Seamounts", "year": 2022, "doi": "10.1111/fog.12612", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science"], "discipline": "Natural Sciences", "journal": "Wiley", "url": "https://openalex.org/W4309451665", "numberOfCitations": 0 }, { "title": "Accumulation, transformation and transport of microplastics in estuarine fronts", "year": 2022, "doi": "10.1038/s43017-022-00349-x", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "Springer Nature", "url": "https://www.nature.com/articles/s43017-022-00349-x.pdf", "numberOfCitations": 2 }, { "title": "Exceptional freshening and cooling in the eastern subpolar North Atlantic caused by reduced Labrador Sea surface heat loss", "year": 2022, "doi": "10.5194/os-18-1507-2022", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science"], "discipline": "Natural Sciences", "journal": null, "url": "https://os.copernicus.org/articles/18/1507/2022/os-18-1507-2022.pdf", "numberOfCitations": 0 }, { "title": "Influence of Particle Size and Fragmentation on Large-Scale Microplastic Transport in the Mediterranean Sea", "year": 2022, "doi": "10.1021/acs.est.2c03363", "pmid": "36270631", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "American Chemical Society", "url": "https://openalex.org/W4307029492", "numberOfCitations": 1 }, { "title": "Biophysical larval dispersal models of observed bonefish (Albula vulpes) spawning events in Abaco, The Bahamas: An assessment of population connectivity and ocean dynamics", "year": 2022, "doi": "10.1371/journal.pone.0276528", "pmid": "36264943", "pmcid": "9584404", "database": "OpenAlex", "authors": [], "fields": ["Biology", "Geography", "Environmental science"], "discipline": "Natural Sciences", "journal": "Public Library of Science", "url": "https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0276528&type=printable", "numberOfCitations": 0 }, { "title": "Mesoscale oceanographic features drive divergent patterns in connectivity for co‐occurring estuarine portunid crabs", "year": 2022, "doi": "10.1111/fog.12608", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Biology", "Geography", "Environmental science"], "discipline": "Natural Sciences", "journal": "Wiley", "url": "https://onlinelibrary.wiley.com/doi/pdfdirect/10.1111/fog.12608", "numberOfCitations": 0 }, { "title": "The Natal Bight Coastal Counter-Current: A modeling study", "year": 2022, "doi": "10.1016/j.csr.2022.104852", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Geography", "Unknown"], "discipline": "Natural Sciences", "journal": "Elsevier", "url": "https://openalex.org/W4297359458", "numberOfCitations": 0 }, { "title": "Climate-Change Refugia for the Bubblegum Coral Paragorgia arborea in the Northwest Atlantic", "year": 2022, "doi": "10.3389/fmars.2022.863693", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geography", "Environmental science"], "discipline": "Social Sciences", "journal": "Frontiers Media SA", "url": "https://www.frontiersin.org/articles/10.3389/fmars.2022.863693/pdf", "numberOfCitations": 0 }, { "title": "Investigating microscale patchiness of motile microbes under turbulence in a simulated convective mixed layer", "year": 2022, "doi": "10.1371/journal.pcbi.1010291", "pmid": "35895753", "pmcid": "9380958", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science", "Physics"], "discipline": "Applied Sciences", "journal": "PLoS Computational Biology", "url": "https://journals.plos.org/ploscompbiol/article/file?id=10.1371/journal.pcbi.1010291&type=printable", "numberOfCitations": 0 }, { "title": "Ichthyoplankton assemblages and physical characteristics of two submarine canyons in the south central Tyrrhenian Sea", "year": 2022, "doi": "10.1111/fog.12596", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science"], "discipline": "Natural Sciences", "journal": "Wiley", "url": "https://openalex.org/W4282012778", "numberOfCitations": 1 }, { "title": "Force on inertial particles crossing a two layer stratified turbulent/non-turbulent interface", "year": 2022, "doi": "10.1016/j.ijmultiphaseflow.2022.104153", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Physics"], "discipline": "Natural Sciences", "journal": "Elsevier", "url": "https://openalex.org/W4281746319", "numberOfCitations": 0 }, { "title": "PlanktonIndividuals.jl: A GPU supported individual-based phytoplankton life cycle model", "year": 2022, "doi": "10.21105/joss.04207", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Computer science", "Psychology"], "discipline": "Applied Sciences", "journal": "The Open Journal", "url": "https://joss.theoj.org/papers/10.21105/joss.04207.pdf", "numberOfCitations": 1 }, { "title": "Biological Carbon Pump Sequestration Efficiency in the North Atlantic: A Leaky or a Long‐Term Sink?", "year": 2022, "doi": "10.1029/2021gb007286", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Geology", "Chemistry"], "discipline": "Natural Sciences", "journal": "Wiley", "url": "http://nora.nerc.ac.uk/id/eprint/532745/1/Global%20Biogeochemical%20Cycles%20-%202022%20-%20Baker%20-%20Biological%20Carbon%20Pump%20Sequestration%20Efficiency%20in%20the%20North%20Atlantic%20%20A.pdf", "numberOfCitations": 1 }, { "title": "Tracking a Rain-Induced Low-Salinity Pool in the South China Sea Using Satellite and Quasi-Lagrangian Field Observations", "year": 2022, "doi": "10.3390/rs14092030", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science"], "discipline": "Natural Sciences", "journal": "MDPI AG", "url": "https://www.mdpi.com/2072-4292/14/9/2030/pdf?version=1650706870", "numberOfCitations": 1 }, { "title": "Seasonal and spatial variations in spice generation in the South Indian Ocean salinity maxima", "year": 2022, "doi": "10.1007/s10236-022-01502-2", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science"], "discipline": "Natural Sciences", "journal": "Springer Nature", "url": "https://openalex.org/W4226373256", "numberOfCitations": 0 }, { "title": "Particulate trace element distributions along the Canadian Arctic GEOTRACES section: shelf-water interactions, advective transport and contrasting biological production", "year": 2022, "doi": "10.1016/j.gca.2022.02.013", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science", "Chemistry"], "discipline": "Natural Sciences", "journal": "Elsevier", "url": "https://openalex.org/W4213091736", "numberOfCitations": 1 }, { "title": "Persistence and material coherence of a mesoscale ocean eddy", "year": 2022, "doi": "10.1103/physrevfluids.7.034501", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Physics", "Environmental science"], "discipline": "Natural Sciences", "journal": "American Physical Society", "url": "http://arxiv.org/pdf/2111.08351", "numberOfCitations": 1 }, { "title": "Sediments in Sea Ice Drive the Canada Basin Surface Mn Maximum: Insights From an Arctic Mn Ocean Model", "year": 2021, "doi": "10.1029/2022gb007320", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "Global Biogeochemical Cycles", "url": "https://www.semanticscholar.org/paper/5974f7eb26154b87364557e72538780a0f8c1a4c", "numberOfCitations": 2 }, { "title": "Efficiently Simulating Lagrangian Particles in Large-Scale Ocean", "year": 2022, "doi": "", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "", "url": "https://www.semanticscholar.org/paper/8f75433a996c0baf7bb26c42c54b1c72f1866a4d", "numberOfCitations": 0 }, { "title": "The 2019 northeast Brazil oil spill: scenarios", "year": 2022, "doi": "10.1590/0001-3765202220210391", "pmid": "36074487", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Geology"], "discipline": "Applied Sciences", "journal": "SciELO", "url": "https://www.scielo.br/j/aabc/a/KJtdXzjnSt7DKQfNBQJMnqg/?lang=en&format=pdf", "numberOfCitations": 0 }, { "title": "Modeling the Fate and Transport of Microplastics in Coastal Areas", "year": 2022, "doi": "10.1007/978-3-030-89220-3_12", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Unknown"], "discipline": "Unknown", "journal": "Emerging Contaminants and Associated Treatment Technologies", "url": "https://www.semanticscholar.org/paper/b62db21a46bb714c53976ad5ad3e7ef935e43699", "numberOfCitations": 0 }, { "title": "ROMSPath v1.0: Offline Particle Tracking for the Regional Ocean Modeling System (ROMS)", "year": 2021, "doi": "10.5194/gmd-2021-400", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Computer science"], "discipline": "Formal Sciences", "journal": "Geoscientific Model Development", "url": "https://gmd.copernicus.org/articles/15/4297/2022/gmd-15-4297-2022.pdf", "numberOfCitations": 1 }, { "title": "Including the effects of subsurface currents on buoyant particles in Lagrangian particle tracking models: Model development and its application to the study of riverborne plastics over the Louisiana/Texas shelf", "year": 2021, "doi": "10.1016/j.ocemod.2021.101879", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science", "Unknown"], "discipline": "Natural Sciences", "journal": "Elsevier", "url": "https://openalex.org/W3197340961", "numberOfCitations": 3 }, { "title": "Life in the Fast Lane: Modeling the Fate of Glass Sponge Larvae in the Gulf Stream", "year": 2021, "doi": "10.3389/fmars.2021.701218", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geography", "Geology", "Environmental science"], "discipline": "Social Sciences", "journal": "Frontiers Media SA", "url": "https://www.frontiersin.org/articles/10.3389/fmars.2021.701218/pdf", "numberOfCitations": 4 }, { "title": "Advective pathways and transit times of the Red Sea Overflow Water in the Arabian Sea from Lagrangian simulations", "year": 2021, "doi": "10.1016/j.pocean.2021.102697", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Geography", "Environmental science"], "discipline": "Natural Sciences", "journal": "Elsevier", "url": "https://doi.org/10.1016/j.pocean.2021.102697", "numberOfCitations": 1 }, { "title": "Passive tracer advection in the equatorial Pacific region: statistics, correlations, and a model of fractional Brownian motion", "year": 2021, "doi": "10.5194/os-2021-94", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "Ocean Science Discussions", "url": "https://os.copernicus.org/articles/18/307/2022/os-18-307-2022.pdf", "numberOfCitations": 0 }, { "title": "Sedimentary microplankton distributions are shaped by oceanographically connected areas", "year": 2021, "doi": "10.5194/esd-2021-48", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science", "Geography"], "discipline": "Applied Sciences", "journal": "Earth System Dynamics Discussions", "url": "https://esd.copernicus.org/articles/13/357/2022/esd-13-357-2022.pdf", "numberOfCitations": 0 }, { "title": "Investigating the internal structure of the Antarctic Ice Sheet: the utility of isochrones for spatio-temporal ice sheet model calibration", "year": 2021, "doi": "10.5194/egusphere-egu21-9446", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "The Cryosphere", "url": "https://boris.unibe.ch/164883/1/sutter21tc_isochronemodelingANT.pdf", "numberOfCitations": 6 }, { "title": "Investigating microscale patchiness of motile microbes driven by the interaction of turbulence and gyrotaxis in a 3D simulated convective mixed layer.", "year": 2021, "doi": "10.21203/rs.3.rs-152503/v2", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "", "url": "https://www.researchsquare.com/article/rs-152503/latest.pdf", "numberOfCitations": 0 }, { "title": "Revisiting the Atlantic South Equatorial Current", "year": 2021, "doi": "10.1029/2021jc017387", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Geography", "History"], "discipline": "Natural Sciences", "journal": "Wiley", "url": "https://openalex.org/W3167258239", "numberOfCitations": 4 }, { "title": "Modeling the Exposure of the Macaronesia Islands (NE Atlantic) to Marine Plastic Pollution", "year": 2021, "doi": "10.3389/fmars.2021.653502", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geography", "Environmental science", "Geology"], "discipline": "Social Sciences", "journal": "Frontiers Media SA", "url": "https://www.frontiersin.org/articles/10.3389/fmars.2021.653502/pdf", "numberOfCitations": 6 }, { "title": "Speeding up Python-based Lagrangian Fluid-Flow Particle Simulations via Dynamic Collection Data Structures", "year": 2021, "doi": "", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Computer science"], "discipline": "Formal Sciences", "journal": "ArXiv", "url": "https://www.semanticscholar.org/paper/5e42bf697c55bc41f73157d0c34dddc0ff3e38ee", "numberOfCitations": 3 }, { "title": "Evaluating high-frequency radar data assimilation impact in coastal ocean operational modelling", "year": 2021, "doi": "10.5194/os-17-1157-2021", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Computer science", "Geology"], "discipline": "Applied Sciences", "journal": null, "url": "https://os.copernicus.org/articles/17/1157/2021/os-17-1157-2021.pdf", "numberOfCitations": 5 }, { "title": "Global simulations of marine plastic transport show plastic trapping in coastal zones", "year": 2021, "doi": "10.1088/1748-9326/abecbd", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Geology"], "discipline": "Applied Sciences", "journal": "IOP Publishing", "url": "https://doi.org/10.1088/1748-9326/abecbd", "numberOfCitations": 41 }, { "title": "Characteristics and robustness of Agulhas leakage estimates: an inter-comparison study of Lagrangian methods", "year": 2021, "doi": "10.5194/os-17-1067-2021", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science"], "discipline": "Natural Sciences", "journal": null, "url": "https://os.copernicus.org/articles/17/1067/2021/os-17-1067-2021.pdf", "numberOfCitations": 5 }, { "title": "On the Impact of the Caribbean Counter Current in the Guajira Upwelling System", "year": 2021, "doi": "10.3389/fmars.2021.626823", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geography", "Geology", "Environmental science"], "discipline": "Social Sciences", "journal": "Frontiers Media SA", "url": "https://www.frontiersin.org/articles/10.3389/fmars.2021.626823/pdf", "numberOfCitations": 5 }, { "title": "Evaluating numerical and free-drift forecasts of sea ice drift during a Southern Ocean research expedition: An operational perspective", "year": 2021, "doi": "10.1080/1755876x.2021.1883293", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science", "Computer science"], "discipline": "Natural Sciences", "journal": "Informa", "url": "https://openalex.org/W3129101410", "numberOfCitations": 5 }, { "title": "The Grounding of Floating Objects in a Marginal Sea", "year": 2020, "doi": "10.1175/jpo-d-20-0183.1", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "Journal of Physical Oceanography", "url": "https://journals.ametsoc.org/downloadpdf/journals/phoc/51/2/jpo-d-20-0183.1.pdf", "numberOfCitations": 3 }, { "title": "Comparing models and observations of the surface accumulation zone of floating plastic in the North Atlantic subtropical gyre", "year": 2021, "doi": "", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "", "url": "https://www.semanticscholar.org/paper/d3f0bee127057dd01a2a79530064c8efa184171a", "numberOfCitations": 0 }, { "title": "Supplementary material to \"Sedimentary microplankton distributions are shaped by oceanographically connected areas\"", "year": 2021, "doi": "10.5194/esd-2021-48-supplement", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "", "url": "https://doi.org/10.5194/esd-2021-48-supplement", "numberOfCitations": 0 }, { "title": "Autonomous vehicle surveys indicate that flow reversals retain juvenile fishes in a highly advective high‐latitude ecosystem", "year": 2021, "doi": "10.1002/lno.11671", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science", "Geography"], "discipline": "Natural Sciences", "journal": "Wiley", "url": "https://onlinelibrary.wiley.com/doi/pdfdirect/10.1002/lno.11671", "numberOfCitations": 5 }, { "title": "3-D ocean particle tracking modeling reveals extensive vertical movement and downstream interdependence of closed areas in the northwest Atlantic", "year": 2020, "doi": "10.1038/s41598-020-76617-x", "pmid": "33293594", "pmcid": "/articles/7722887", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Geology", "Geography"], "discipline": "Applied Sciences", "journal": "Springer Nature", "url": "https://www.nature.com/articles/s41598-020-76617-x.pdf", "numberOfCitations": 5 }, { "title": "Simulating the internal structure of the Antarctic Ice Sheet – towards\na spatio-temporal calibration for ice-sheet modelling", "year": 2020, "doi": "10.5194/tc-2020-349", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science", "Geography"], "discipline": "Applied Sciences", "journal": "The Cryosphere Discussions", "url": "https://tc.copernicus.org/articles/15/3839/2021/tc-15-3839-2021.pdf", "numberOfCitations": 2 }, { "title": "Subtropical-tropical pathways of spiciness anomalies and their impact on equatorial Pacific temperature", "year": 2021, "doi": "10.1007/s00382-020-05524-8", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science", "Geography"], "discipline": "Natural Sciences", "journal": "Springer Nature", "url": "https://openalex.org/W3107162706", "numberOfCitations": 7 }, { "title": "Phylogeographic structure and population connectivity of a small benthic fish (Tripterygion tripteronotum) in the Adriatic Sea", "year": 2020, "doi": "10.1111/jbi.13946", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "Journal of Biogeography", "url": "https://onlinelibrary.wiley.com/doi/pdfdirect/10.1111/jbi.13946", "numberOfCitations": 3 }, { "title": "Multiple spawning events promote increased larval dispersal of a predatory fish in a western boundary current", "year": 2020, "doi": "10.1111/fog.12473", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Biology", "Geography", "Environmental science"], "discipline": "Natural Sciences", "journal": "Wiley", "url": "https://openalex.org/W3010741048", "numberOfCitations": 20 }, { "title": "Ordering of trajectories reveals hierarchical finite-time coherent sets in Lagrangian particle data: detecting Agulhas rings in the South Atlantic Ocean", "year": 2020, "doi": "10.5194/npg-2020-28", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Physics", "Computer science"], "discipline": "Natural Sciences", "journal": "Nonlinear Processes in Geophysics", "url": "https://npg.copernicus.org/articles/28/43/2021/npg-28-43-2021.pdf", "numberOfCitations": 5 }, { "title": "Observations of a Deep Submesoscale Cyclonic Vortex in the Arabian Sea", "year": 2020, "doi": "10.1029/2020gl087881", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science"], "discipline": "Natural Sciences", "journal": "Wiley", "url": "https://archimer.ifremer.fr/doc/00695/80731/84552.pdf", "numberOfCitations": 12 }, { "title": "Beaching patterns of plastic debris along the Indian Ocean rim", "year": 2020, "doi": "10.5194/os-2020-50", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "Ocean Science", "url": "https://os.copernicus.org/articles/16/1317/2020/os-16-1317-2020.pdf", "numberOfCitations": 20 }, { "title": "Depth-Dependent Correction for Wind-Driven Drift Current in Particle Tracking Applications", "year": 2020, "doi": "10.3389/fmars.2020.00305", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science", "Physics"], "discipline": "Applied Sciences", "journal": "", "url": "https://www.frontiersin.org/articles/10.3389/fmars.2020.00305/pdf", "numberOfCitations": 14 }, { "title": "Eddies in the Hawaiian Archipelago Region: Formation, Characterization, and Potential Implications on Larval Retention of Reef Fish", "year": 2020, "doi": "10.1029/2019jc015348", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "Journal of Geophysical Research: Oceans", "url": "https://onlinelibrary.wiley.com/doi/pdfdirect/10.1029/2019JC015348", "numberOfCitations": 6 }, { "title": "A New Improved Estimation of Agulhas Leakage Using Observations and Simulations of Lagrangian Floats and Drifters", "year": 2020, "doi": "10.1029/2019jc015753", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "Journal of Geophysical Research", "url": "https://www.semanticscholar.org/paper/605dacb7dc530dc671e32569397ab1bb7b3942ec", "numberOfCitations": 11 }, { "title": "Evaluation of isotopes and elements in planktonic foraminifera from the Mediterranean Sea as recorders of seawater oxygen isotopes and salinity", "year": 2020, "doi": "10.5194/cp-2020-26", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science", "Geography"], "discipline": "Applied Sciences", "journal": "Climate of The Past Discussions", "url": "https://cp.copernicus.org/articles/16/2401/2020/cp-16-2401-2020.pdf", "numberOfCitations": 1 }, { "title": "Microbial evolutionary strategies in a dynamic ocean", "year": 2020, "doi": "10.1073/pnas.1919332117", "pmid": "32123112", "pmcid": "/articles/7084144", "database": "OpenAlex", "authors": [], "fields": ["Biology", "Environmental science"], "discipline": "Natural Sciences", "journal": "Proceedings of the National Academy of Sciences", "url": "https://www.pnas.org/content/pnas/117/11/5943.full.pdf", "numberOfCitations": 22 }, { "title": "Modelling marine particle dynamics with LTRANS-Zlev: implementation and validation", "year": 2020, "doi": "10.1016/j.envsoft.2020.104621", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "Environ. Model. Softw.", "url": "https://www.semanticscholar.org/paper/7c98f62b61d1a987f72e8271e6c8a39414aa94bc", "numberOfCitations": 3 }, { "title": "The physical oceanography of the transport of floating marine debris", "year": 2020, "doi": "10.1088/1748-9326/ab6d7d", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Geology"], "discipline": "Applied Sciences", "journal": "IOP Publishing", "url": "https://doi.org/10.1088/1748-9326/ab6d7d", "numberOfCitations": 247 }, { "title": "Object narratives as a methodology for mitigating marine plastic pollution: multidisciplinary investigations in Galápagos", "year": 2020, "doi": "10.15184/aqy.2019.232", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geography", "History", "Computer science", "Environmental science", "Sociology"], "discipline": "Social Sciences", "journal": "Antiquity Publications", "url": "https://eprints.whiterose.ac.uk/147190/1/Object_narratives_as_a_methodology_for_mitigating_marine_plastic_pollution_a_new_multidisciplinary_approach_and_a_case_study_from_Galapagos.pdf", "numberOfCitations": 16 }, { "title": "A global mean sea surface temperature dataset for the Last Interglacial (129–116 ka) and contribution of thermal expansion to sea level change", "year": 2020, "doi": "10.5194/essd-2019-249", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science", "Geography"], "discipline": "Applied Sciences", "journal": "Earth System Science Data", "url": "https://essd.copernicus.org/articles/12/3341/2020/essd-12-3341-2020.pdf", "numberOfCitations": 16 }, { "title": "Influence of Barotropic Tidal Currents on Transport and Accumulation of Floating Microplastics in the Global Open Ocean", "year": 2020, "doi": "10.1029/2019jc015583", "pmid": "32714728", "pmcid": "/articles/7375081", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Geology", "Physics"], "discipline": "Applied Sciences", "journal": "Wiley", "url": "https://doi.org/10.1029/2019jc015583", "numberOfCitations": 24 }, { "title": "Unraveling the choice of the north Atlantic subpolar gyre index", "year": 2020, "doi": "10.1038/s41598-020-57790-5", "pmid": "31969636", "pmcid": "6976698", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "Scientific Reports", "url": "https://www.nature.com/articles/s41598-020-57790-5.pdf", "numberOfCitations": 17 }, { "title": "Intergyre Salt Transport in the Climate Warming Response", "year": 2020, "doi": "10.1175/jpo-d-19-0166.1", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Geology"], "discipline": "Applied Sciences", "journal": "American Meteorological Society", "url": "https://journals.ametsoc.org/downloadpdf/journals/phoc/50/1/jpo-d-19-0166.1.pdf", "numberOfCitations": 2 }, { "title": "Evaluation of oxygen isotopes and trace elements in planktonic foraminifera from the Mediterranean Sea as recorders of seawater oxygen isotopes and salinity", "year": 2020, "doi": "10.5194/cp-16-2401-2020", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Chemistry", "Environmental science", "Geography"], "discipline": "Natural Sciences", "journal": null, "url": "https://cp.copernicus.org/articles/16/2401/2020/cp-16-2401-2020.pdf", "numberOfCitations": 6 }, { "title": "Proceedings of the 2nd International Conference on Microplastic Pollution in the Mediterranean Sea", "year": 2020, "doi": "10.1007/978-3-030-45909-3", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "Proceedings of the 2nd International Conference on Microplastic Pollution in the Mediterranean Sea", "url": "https://www.semanticscholar.org/paper/73e241b81f40b1652e8bad568880639b8326c888", "numberOfCitations": 2 }, { "title": "Mixing of passive tracers at the ocean surface and its implications for plastic transport modelling", "year": 2019, "doi": "10.1088/2515-7620/ab4e77", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Geology"], "discipline": "Applied Sciences", "journal": "IOP Publishing", "url": "https://doi.org/10.1088/2515-7620/ab4e77", "numberOfCitations": 4 }, { "title": "Environmental versus operational drivers of drifting FAD beaching in the Western and Central Pacific Ocean", "year": 2019, "doi": "10.1038/s41598-019-50364-0", "pmid": "31570729", "pmcid": "6768996", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "Scientific Reports", "url": "https://www.nature.com/articles/s41598-019-50364-0.pdf", "numberOfCitations": 10 }, { "title": "Modelling the Global Distribution of Beaching of Marine Plastic", "year": 2019, "doi": "10.1007/978-3-030-45909-3_48", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "", "url": "https://www.semanticscholar.org/paper/bf9c0ad4438638f636e379e301abfb3c3dcf4d94", "numberOfCitations": 0 }, { "title": "Influence of Near‐Surface Currents on the Global Dispersal of Marine Microplastic", "year": 2019, "doi": "10.1029/2019jc015328", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Geology"], "discipline": "Applied Sciences", "journal": "Wiley", "url": "https://doi.org/10.1029/2019jc015328", "numberOfCitations": 60 }, { "title": "Transport Bias by Ocean Currents in Sedimentary Microplankton Assemblages: Implications for Paleoceanographic Reconstructions", "year": 2019, "doi": "10.1029/2019pa003606", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science", "Geography"], "discipline": "Natural Sciences", "journal": "Wiley", "url": "https://agupubs.onlinelibrary.wiley.com/doi/pdfdirect/10.1029/2019PA003606", "numberOfCitations": 21 }, { "title": "Validating Ocean General Circulation Models via Lagrangian Particle Simulation and Data from Drifting Buoys", "year": 2019, "doi": "10.1007/978-3-030-22747-0_20", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "", "url": "https://eprints.ucm.es/id/eprint/63391/1/gomez-ullate44%20postprint.pdf", "numberOfCitations": 1 }, { "title": "Regional connectivity and spatial densities of drifting fish aggregating devices, simulated from fishing events in the Western and Central Pacific Ocean", "year": 2019, "doi": "10.1088/2515-7620/ab21e9", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "Environmental Research Communications", "url": "https://www.semanticscholar.org/paper/9b737f0b86746fd5c2ff1ddc63ea47f5e88d2f79", "numberOfCitations": 7 }, { "title": "Object narratives as a methodology for mitigating marine plastic pollution: a new multidisciplinary approach, and a case study from Galápagos", "year": 2019, "doi": "", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "", "url": "https://www.semanticscholar.org/paper/1990d39aad0bbc8adce91d6acb9d8392bd2893c1", "numberOfCitations": 4 }, { "title": "Hitting a moving target: Microbial evolutionary strategies in a dynamic ocean", "year": 2019, "doi": "10.1101/637272", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science", "Biology"], "discipline": "Applied Sciences", "journal": "bioRxiv", "url": "https://www.biorxiv.org/content/biorxiv/early/2019/05/16/637272.full.pdf", "numberOfCitations": 0 }, { "title": "Basin-scale sources and pathways of microplastic that ends up in the Galápagos Archipelago", "year": 2019, "doi": "10.5194/os-15-1341-2019", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Geography", "Environmental science"], "discipline": "Natural Sciences", "journal": null, "url": "https://eprints.whiterose.ac.uk/152083/8/os_15_1341_2019.pdf", "numberOfCitations": 19 }, { "title": "Kernel methods for detecting coherent structures in dynamical data", "year": 2019, "doi": "10.1063/1.5100267", "pmid": "31893642", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Mathematics", "Computer science"], "discipline": "Formal Sciences", "journal": "American Institute of Physics", "url": "http://arxiv.org/pdf/1904.07752", "numberOfCitations": 17 }, { "title": "Role of Indian Ocean Dynamics on Accumulation of Buoyant Debris", "year": 2019, "doi": "10.1029/2018jc014806", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Geology"], "discipline": "Applied Sciences", "journal": "Wiley", "url": "https://dspace.library.uu.nl/bitstream/1874/380546/1/Mheen_et_al_2019_Journal_of_Geophysical_Research_Oceans.pdf", "numberOfCitations": 31 }, { "title": "A 3D numerical model to Track Marine Plastic Debris (TrackMPD): Sensitivity of microplastic trajectories and fates to particle dynamical properties and physical processes", "year": 2019, "doi": "10.1016/j.marpolbul.2019.02.052", "pmid": "30955734", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Physics"], "discipline": "Applied Sciences", "journal": "Elsevier", "url": "https://openalex.org/W2919185035", "numberOfCitations": 58 }, { "title": "Plastics in sea surface waters around the Antarctic Peninsula", "year": 2019, "doi": "10.1038/s41598-019-40311-4", "pmid": "30850657", "pmcid": "/articles/6408452", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Geology"], "discipline": "Applied Sciences", "journal": "Springer Nature", "url": "https://www.nature.com/articles/s41598-019-40311-4.pdf", "numberOfCitations": 145 }, { "title": "The Role of Ekman Currents, Geostrophy, and Stokes Drift in the Accumulation of Floating Microplastic", "year": 2019, "doi": "10.1029/2018jc014547", "pmid": "31218155", "pmcid": "/articles/6559306", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science"], "discipline": "Natural Sciences", "journal": "Wiley", "url": "https://agupubs.onlinelibrary.wiley.com/doi/pdfdirect/10.1029/2018JC014547", "numberOfCitations": 90 }, { "title": "The Impact of Plastic Pollution on Marine Turtles", "year": 2019, "doi": "", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "", "url": "https://www.semanticscholar.org/paper/cda01569edfda4bce275000bfae9f9f10fd93f61", "numberOfCitations": 0 }, { "title": "The Parcels v2.0 Lagrangian framework: new field interpolation schemes", "year": 2019, "doi": "10.5194/gmd-12-3571-2019", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Computer science", "Geology", "Mathematics", "Environmental science"], "discipline": "Formal Sciences", "journal": null, "url": "https://doi.org/10.5194/gmd-12-3571-2019", "numberOfCitations": 99 }, { "title": "Modeling Dispersal of UV Filters in Estuaries", "year": 2019, "doi": "10.1021/acs.est.8b03725", "pmid": "30632364", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Chemistry"], "discipline": "Applied Sciences", "journal": "American Chemical Society", "url": "https://minerva.usc.es/xmlui/bitstream/10347/18278/1/EnvironSciTechnol_53_2019_1353_with_SI_postprint.pdf", "numberOfCitations": 8 }, { "title": "Computational Science – ICCS 2019", "year": 2019, "doi": "10.1007/978-3-030-22747-0", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Computer science"], "discipline": "Formal Sciences", "journal": "", "url": "https://bird.bcamath.org/bitstream/20.500.11824/1058/1/2019-SM-ICCS.pdf", "numberOfCitations": 4 }, { "title": "Comparison of Physical Connectivity Particle Tracking Models in the Flemish Cap Region", "year": 2019, "doi": "", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Mathematics"], "discipline": "Formal Sciences", "journal": "", "url": "https://www.semanticscholar.org/paper/ac3bb5877802dc855c0c0e1f1789db911fe54d76", "numberOfCitations": 0 }, { "title": "Developments in Lagrangian Data Assimilation and Coupled Data Assimilation to Support Earth System Model Initialization", "year": 2019, "doi": "10.13016/9jq0-u5br", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "", "url": "https://www.semanticscholar.org/paper/3584a47173b0df797728cee92347c5476d65b9d1", "numberOfCitations": 0 }, { "title": "Seascape genetics of the spiny lobster<i>Panulirus homarus</i>in the Western Indian Ocean: Understanding how oceanographic features shape the genetic structure of species with high larval dispersal potential", "year": 2018, "doi": "10.1002/ece3.4684", "pmid": "30598813", "pmcid": "/articles/6303728", "database": "OpenAlex", "authors": [], "fields": ["Biology", "Geology", "Environmental science"], "discipline": "Natural Sciences", "journal": "Wiley", "url": "https://onlinelibrary.wiley.com/doi/pdfdirect/10.1002/ece3.4684", "numberOfCitations": 15 }, { "title": "The true depth of the Mediterranean plastic problem: Extreme microplastic pollution on marine turtle nesting beaches in Cyprus", "year": 2018, "doi": "10.1016/j.marpolbul.2018.09.019", "pmid": "30509815", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Biology"], "discipline": "Applied Sciences", "journal": "Elsevier", "url": "https://dspace.library.uu.nl/bitstream/1874/371803/1/1_s2.0_S0025326X18306581_main.pdf", "numberOfCitations": 34 }, { "title": "Phytoplankton thermal responses adapt in the absence of hard thermodynamic constraints", "year": 2020, "doi": "10.1111/evo.13946", "pmid": "32118294", "pmcid": "/articles/7384082", "database": "OpenAlex", "authors": [], "fields": ["Biology", "Environmental science"], "discipline": "Natural Sciences", "journal": "Wiley", "url": "https://onlinelibrary.wiley.com/doi/pdfdirect/10.1111/evo.13946", "numberOfCitations": 21 }, { "title": "Assessing the accuracy of satellite derived ocean currents by comparing observed and virtual buoys in the Greater Agulhas Region", "year": 2018, "doi": "10.1016/j.rse.2018.03.040", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science"], "discipline": "Natural Sciences", "journal": "Elsevier", "url": "https://openalex.org/W2796012474", "numberOfCitations": 17 }, { "title": "The Algorithm for Transferring a Large Number of Radionuclide Particles in a Parallel Model of Ocean Hydrodynamics", "year": 2018, "doi": "10.1007/978-3-030-05807-4_14", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "", "url": "https://www.semanticscholar.org/paper/fda14150fd4c5357b23e2f14860782b90391b476", "numberOfCitations": 1 }, { "title": "An individual-based model of skipjack tuna (Katsuwonus pelamis) movement in the tropical Pacific ocean", "year": 2018, "doi": "10.1016/j.pocean.2018.04.007", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Environmental science"], "discipline": "Applied Sciences", "journal": "Progress in Oceanography", "url": "https://www.semanticscholar.org/paper/9e5cebfaa74a82386ac7a037c3fed84da2f15e7e", "numberOfCitations": 15 }, { "title": "Surface Connectivity and Interocean Exchanges From Drifter-Based Transition Matrices", "year": 2018, "doi": "10.1002/2017jc013363", "pmid": "29576995", "pmcid": "/articles/5856081", "database": "OpenAlex", "authors": [], "fields": ["Unknown", "Environmental science"], "discipline": "Unknown", "journal": "Wiley", "url": "https://agupubs.onlinelibrary.wiley.com/doi/pdfdirect/10.1002/2017JC013363", "numberOfCitations": 25 }, { "title": "Lagrangian ocean analysis: Fundamentals and practices", "year": 2018, "doi": "10.1016/j.ocemod.2017.11.008", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Geology", "Geography"], "discipline": "Applied Sciences", "journal": "Elsevier", "url": "https://doi.org/10.1016/j.ocemod.2017.11.008", "numberOfCitations": 229 }, { "title": "PENGEMBANGAN INSTRUMEN LAGRANGIAN GPS DRIFTER COMBINED (GERNED) UNTUK OBSERVASI LAUT", "year": 2017, "doi": "10.15578/jkn.v12i3.6323", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Unknown"], "discipline": "Unknown", "journal": "", "url": "http://ejournal-balitbang.kkp.go.id/index.php/jkn/article/download/6323/pdf", "numberOfCitations": 3 }, { "title": "Molecular phylogeny and seascape genetics of the panulirus homarus subspecies in the Western Indian Ocean.", "year": 2016, "doi": "", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Biology", "Environmental science"], "discipline": "Natural Sciences", "journal": "", "url": "https://www.semanticscholar.org/paper/b103e2572c800e90db21f5de987baab40a9f7a8a", "numberOfCitations": 0 }, { "title": "A 3 D numerical model to Track Marine Plastic Debris ( TrackMPD ) : 1 Sensitivity of microplastic trajectories and fates to particle dynamical 2 properties and physical processes 3", "year": null, "doi": "", "pmid": "", "pmcid": "", "database": "SemanticScholar", "authors": [], "fields": ["Physics"], "discipline": "Natural Sciences", "journal": "", "url": "https://www.semanticscholar.org/paper/46b5d337fbe2cf5776031406ad26c096ac1dd4c2", "numberOfCitations": 0 }, { "title": "Beaching patterns of plastic debris along the Indian Ocean rim", "year": 2020, "doi": "10.5194/os-16-1317-2020", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science"], "discipline": "Natural Sciences", "journal": null, "url": "https://os.copernicus.org/articles/16/1317/2020/os-16-1317-2020.pdf", "numberOfCitations": 16 }, { "title": "A global mean sea surface temperature dataset for the Last Interglacial (129–116 ka) and contribution of thermal expansion to sea level change", "year": 2020, "doi": "10.5194/essd-12-3341-2020", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Environmental science", "Geology"], "discipline": "Applied Sciences", "journal": null, "url": "https://essd.copernicus.org/articles/12/3341/2020/essd-12-3341-2020.pdf", "numberOfCitations": 12 }, { "title": "Investigating the internal structure of the Antarctic ice sheet: the utility of isochrones for spatiotemporal ice-sheet model calibration", "year": 2021, "doi": "10.5194/tc-15-3839-2021", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology"], "discipline": "Natural Sciences", "journal": null, "url": "https://tc.copernicus.org/articles/15/3839/2021/tc-15-3839-2021.pdf", "numberOfCitations": 7 }, { "title": "Ordering of trajectories reveals hierarchical finite-time coherent sets in Lagrangian particle data: detecting Agulhas rings in the South Atlantic Ocean", "year": 2021, "doi": "10.5194/npg-28-43-2021", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Physics", "Computer science"], "discipline": "Natural Sciences", "journal": null, "url": "https://npg.copernicus.org/articles/28/43/2021/npg-28-43-2021.pdf", "numberOfCitations": 5 }, { "title": "Changes in the Subantarctic Mode Water Properties and Spiciness in the Southern Indian Ocean based on Argo Observations", "year": 2021, "doi": "10.1175/jpo-d-20-0254.1", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology"], "discipline": "Natural Sciences", "journal": "American Meteorological Society", "url": "https://journals.ametsoc.org/downloadpdf/journals/phoc/51/7/JPO-D-20-0254.1.pdf", "numberOfCitations": 1 }, { "title": "Influence of the Gulf of Guinea Islands on the Atlantic Equatorial Undercurrent Circulation", "year": 2021, "doi": "10.1029/2021jc017999", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology"], "discipline": "Natural Sciences", "journal": "Wiley", "url": "https://archimer.ifremer.fr/doc/00793/90511/96083.pdf", "numberOfCitations": 1 }, { "title": "Cross-jurisdictional larval supply essential for eastern Australian spanner crabs (", "year": 2022, "doi": "10.1071/mf21348", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Biology", "Geography"], "discipline": "Natural Sciences", "journal": "CSIRO Publishing", "url": "https://www.publish.csiro.au/mf/pdf/MF21348", "numberOfCitations": 1 }, { "title": "Lagrangian Reconstruction to Extract Small‐Scale Salinity Variability From SMAP Observations", "year": 2021, "doi": "10.1029/2020jc016477", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology", "Environmental science"], "discipline": "Natural Sciences", "journal": "Wiley", "url": "https://digital.csic.es/bitstream/10261/230392/1/Lagrangian_Reconstruction.pdf", "numberOfCitations": 0 }, { "title": "Interaction of an Upwelling Front with External Vortices: Impact on Cross-shore Particle Exchange", "year": 2021, "doi": "10.1134/s1560354721050063", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Physics", "Geology"], "discipline": "Natural Sciences", "journal": "Springer Nature", "url": "https://openalex.org/W3206226750", "numberOfCitations": 0 }, { "title": "Sedimentary microplankton distributions are shaped by oceanographically connected areas", "year": 2022, "doi": "10.5194/esd-13-357-2022", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Geology"], "discipline": "Natural Sciences", "journal": "Copernicus GmbH", "url": null, "numberOfCitations": 0 }, { "title": "ROMSPath v1.0: offline particle tracking for the Regional Ocean Modeling System (ROMS)", "year": 2022, "doi": "10.5194/gmd-15-4297-2022", "pmid": "", "pmcid": "", "database": "OpenAlex", "authors": [], "fields": ["Computer science"], "discipline": "Formal Sciences", "journal": null, "url": "https://gmd.copernicus.org/articles/15/4297/2022/gmd-15-4297-2022.pdf", "numberOfCitations": 0 }], "firstHandCitations": 109, "uniqueFields": ["Environmental science", "Physics", "Computer science", "Geology", "Biology", "Geography", "Unknown", "Psychology", "Chemistry", "History", "Sociology", "Mathematics"], "firstYear": null, "secondHandCitations": 1552, "disciplines": [0, 5, 41, 8, 52], highestCitations: 247 };
    var starfield = new starField(input);

    const chartHeight = 800,
        chartWidth = 900;

    const svg = d3.select("#svgchart")
        .attr("width", chartWidth)
        .attr("height", chartHeight);
    
    var g = svg.append("g")
        .attr("class", "everything");
    
    // functions to avoid nodes and links going outside the svg container, when calculating the position:
    function getNodeXCoordinate(x, r) {
        return Math.max(0, Math.min(chartWidth - r, x))
    }
    function getNodeYCoordinate(y, r) {
        return Math.max(0, Math.min(chartHeight - r, y))
    }

    // create a new simulation (a simulation starts with alpha = 1 and decrese it slowly to 0):
    const simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().distanceMax(300).strength(function (d) { return -(d.size * 20) }))
        .force("collide", d3.forceCollide(function (d) { return d.size + 2 }).iterations(10))
        .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
        .force("link", d3.forceLink());


    const nodes = starfield.nodes
    const links = starfield.links

    // add links
    const link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line") // line to connect nodes
        .attr("stroke-width", 0.5) // line width

    // use a g element to contain nodes:
    const nodeWrapper = g.append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "nodeWrapper")

    // add nodes
    const node = nodeWrapper
        .append("circle")
        .attr("class", "node")
        .attr("r", d => d.size);

    const label = nodeWrapper.append("foreignObject")
        .attr("width", d => d.size * 2)
        .attr("height", d => d.size * 2)
        .attr("x", d => -d.size)
        .attr("y", d => -d.size)
        .append("xhtml:div")
        .attr("class", "label")
        .append("xhtml:p")
        .html(function (d) { return d.name });

    // tooltip div:
    const tooltip = d3.select('#mainContainer').append("div")
        .classed("tooltip", true)
        .style("opacity", 0) // start invisible
    
    var clickedNodes = [];
    var connectedNodesClick = [];

    nodeWrapper
        .on("mouseenter", function (d) {
            var connectedNodes = [];
            var nodes = clickedNodes.concat([d]);
            if (d.id > input.uniqueFields.length) {
                var html =  input.papers[d.id - input.uniqueFields.length].title
                tooltip.transition()
                    .duration(300)
                    .style("opacity", 1); // show the tooltip
                if(input.papers[d.id - input.uniqueFields.length].year !== null){
                    html += "<hr/>" + input.papers[d.id - input.uniqueFields.length].year
                }
                var x = d3.event.pageX - d3.select('.tooltip').node().offsetWidth - 5    
                var chartMiddle = ((chartWidth - d3.select('.tooltip').node().offsetWidth) / 2)
                //html += "\nx: \n" + x + "offsetwidt: \n" +  chartmiddle
                if(x < chartMiddle){
                    tooltip.html(html)
                    .style("left", (d3.event.pageX - d3.select('.tooltip').node().offsetWidth - 5) + "px")
                    .style("top", (d3.event.pageY - d3.select('.tooltip').node().offsetHeight) + "px");
                }
                else{
                    tooltip.html(html)
                    .style("left", (d3.event.pageX - d3.select('.tooltip').node().offsetWidth + chartMiddle + 5) + "px")
                    .style("top", (d3.event.pageY - d3.select('.tooltip').node().offsetHeight) + "px");       
                }
            }
            link.each(function (l) {
                if (d == l.source || d == l.target) {
                    connectedNodes.push(l.source);
                    connectedNodes.push(l.target);
                }
            })
                .transition()
                .duration(300)
                .style("stroke-width", function (l) {
                    if (clickedNodes.length > 0) {
                        if (d.id < input.uniqueFields.length && connectedNodesClick.includes(l.source) && connectedNodes.includes(l.source) && (nodes.includes(l.target))) 
                            return "2px";
                        else if (d.id < input.uniqueFields.length && connectedNodesClick.includes(l.source) && (nodes.includes(l.target))) 
                            return "1px";
                        else
                            return "0.5px";
                    }
                    else {
                        if (nodes.includes(l.source) || nodes.includes(l.target)) {
                            return "2px";
                        }
                        else
                            return "0.5px";
                    }
                });
            node.transition()
                .duration(300)
                .style("stroke", function (d2) {
                    if (clickedNodes.length > 0) {
                        if (nodes.includes(d2) || (connectedNodesClick.includes(d2) ))
                            return "rgb(77, 77, 77)";
                        else
                            return "white";
                    }
                    else {
                        if (connectedNodes.includes(d2))
                            return "rgb(77, 77, 77)";
                        else
                            return "white";
                    }
                })
                .style("stroke-width", function (d2) {
                    if (clickedNodes.length > 0) {
                        if (nodes.includes(d2) || (connectedNodesClick.includes(d2) && connectedNodes.includes(d2)))
                            return "2px";
                        else
                            return "1px";
                    }
                    else {
                        if (connectedNodes.includes(d2))
                            return "2px";
                        else
                            return "1px";
                    }
                });
        })
        .on("mouseleave", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
            link.transition()
                .duration(300)
                .style("stroke-width", function (l) {
                    if (clickedNodes.includes(l.target) && connectedNodesClick.includes(l.source))
                        return "2px";
                    else
                        return "0.5px";
                });
            node.transition()
                .duration(300)
                .style("stroke", function (d2) {
                    if (clickedNodes.includes(d2) || connectedNodesClick.includes(d2))
                            return "rgb(77, 77, 77)";
                        else
                            return "white";
                })
                .style("stroke-width", function (d2) {
                    if (clickedNodes.includes(d2) || connectedNodesClick.includes(d2))
                            return "2px";
                        else
                            return "1px";
                });
        })
        .on("click", function (d) {
            if (d.id > input.uniqueFields.length && input.papers[d.id - input.uniqueFields.length].url !== null)
                window.open(input.papers[d.id - input.uniqueFields.length].url);
            else if (d.id < input.uniqueFields.length && !clickedNodes.includes(d)) {
                var newConnectedNodesClick = [];
                clickedNodes.push(d);
                if (clickedNodes.length == 1) {
                    link.each(function (l) {
                        if (l.target == d)
                            newConnectedNodesClick.push(l.source);
                    });
                }
                else {
                    link.each(function (l) {
                        if (l.target == d && connectedNodesClick.includes(l.source))
                            newConnectedNodesClick.push(l.source);
                    });
                }
                connectedNodesClick = newConnectedNodesClick;
            }
            else if (d.id < input.uniqueFields.length && clickedNodes.includes(d)) {
                clickedNodes = [];
                connectedNodesClick = [];
                link.transition()
                .duration(300)
                .style("stroke-width", function (l) {
                    if (clickedNodes.includes(l.target) && connectedNodesClick.includes(l.source))
                        return "2px";
                    else
                        return "0.5px";
                });
            node.transition()
                .duration(300)
                .style("stroke", function (d2) {
                    if (clickedNodes.includes(d2) || connectedNodesClick.includes(d2))
                            return "rgb(77, 77, 77)";
                        else
                            return "white";
                })
                .style("stroke-width", function (d2) {
                    if (clickedNodes.includes(d2) || connectedNodesClick.includes(d2))
                            return "2px";
                        else
                            return "1px";
                });
            }
        })
    
    //zoom actions
    var zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);
    
    zoom_handler(svg);
    
    function zoom_actions(){
        g.attr("transform", d3.event.transform)
    }
    

    simulation
        .nodes(nodes)
        .on("tick", () => {
            // set each node's position on each tick of the simulation:
            nodeWrapper.attr("transform", d => "translate(" + getNodeXCoordinate(d.x, 30) + "," + getNodeYCoordinate(d.y, 30) + ")")
            // set start (x1,y1) and point (x2,y2) coordinate of each link on each tick of the simulation:
            link.attr("x1", d => getNodeXCoordinate(d.source.x, 30))
            link.attr("y1", d => getNodeYCoordinate(d.source.y, 30))
            link.attr("x2", d => getNodeXCoordinate(d.target.x, 30))
            link.attr("y2", d => getNodeYCoordinate(d.target.y, 30))
        })

    // pass the links to the link force:
    simulation
        .force("link")
        .links(links)
        .distance(30)
}

renderStarField();
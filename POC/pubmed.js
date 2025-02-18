const axios = require("axios");
const fs = require("fs");
const { parseStringPromise } = require("xml2js");

// Function to get citation count from CrossRef API
async function getCitationCountFromCrossRef(doi) {
    try {
        if (!doi || doi === "N/A") return 0;
        const url = `https://api.crossref.org/works/${doi}`;
        const response = await axios.get(url);
        return response.data.message["is-referenced-by-count"] || 0;
    } catch (error) {
        console.error(`Error fetching citation count from CrossRef for DOI ${doi}:`, error);
        return 0;
    }
}

// Function to get citation count from Semantic Scholar API
async function getCitationCountFromSemanticScholar(doi) {
    try {
        if (!doi || doi === "N/A") return 0;
        const url = `https://api.semanticscholar.org/v1/paper/${doi}`;
        const response = await axios.get(url);
        return response.data.citationCount || 0;
    } catch (error) {
        console.error(`Error fetching citation count from Semantic Scholar for DOI ${doi}:`, error);
        return 0;
    }
}

// Function to check if an article is Open Access
function checkOpenAccess(pubmedData) {
    try {
        if (!pubmedData || !pubmedData[0] || !pubmedData[0].ArticleIdList) return "Unknown";

        const articleIds = pubmedData[0].ArticleIdList[0].ArticleId.map(id => ({
            id: id._,
            type: id.$.IdType
        }));

        const pmcid = articleIds.find(id => id.type === "pmc");
        if (pmcid) return `Yes`;

        const status = pubmedData[0].PublicationStatus?.[0] || "";
        if (status.toLowerCase() === "publisher") return "Yes (Publisher Open Access)";

        return "No";
    } catch (error) {
        console.error("Error checking Open Access:", error);
        return "Unknown";
    }
}

// Function to fetch articles from PubMed
async function fetchPubMedArticles(query, maxResults = 10) {
    try {
        // Step 1: Search for articles and get WebEnv & QueryKey
        const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&usehistory=y&retmode=json`;
        const searchResponse = await axios.get(searchUrl);
        const searchData = searchResponse.data.esearchresult;

        if (!searchData.idlist.length) {
            console.log("No articles found.");
            return [];
        }

        const webEnv = searchData.webenv;
        const queryKey = searchData.querykey;

        console.log(searchData.idlist.length, webEnv, queryKey);

        if (!webEnv || !queryKey) {
            console.error("Missing WebEnv or QueryKey from PubMed response.");
            return [];
        }

        // Step 2: Fetch article details using POST with WebEnv & QueryKey
        const detailsUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi`;
        const detailsResponse = await axios.post(detailsUrl, new URLSearchParams({
            db: "pubmed",
            query_key: queryKey,
            WebEnv: webEnv,
            retmode: "xml"
        }), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        const parsedData = await parseStringPromise(detailsResponse.data);
        const articles = parsedData.PubmedArticleSet.PubmedArticle || [];

        // Step 3: Process articles
        const results = await Promise.all(articles.map(async (article) => {
            const medline = article.MedlineCitation[0];
            const articleInfo = medline.Article[0];
            const pubmedData = article.PubmedData;

            const pmid = medline.PMID?.[0]?._ || "N/A";
            const doi = articleInfo.ELocationID?.find(id => id.$.EIdType === "doi")?._ || "N/A";
            const openAccessStatus = checkOpenAccess(pubmedData);

            const crossRefCitations = await getCitationCountFromCrossRef(doi);
            const semanticScholarCitations = await getCitationCountFromSemanticScholar(doi);

            return {
                title: articleInfo.ArticleTitle?.[0] || "N/A",
                doi,
                publication_date: medline.DateCompleted?.[0]?.Year?.[0] || "N/A",
                citations: crossRefCitations ? semanticScholarCitations : 0,
                link: `https://pubmed.ncbi.nlm.nih.gov/${pmid}`,
                open_access: openAccessStatus,
                authors: articleInfo.AuthorList?.[0]?.Author?.map(a => `${a.LastName?.[0]} ${a.ForeName?.[0]}`).join(", ") || "N/A",
                abstract: articleInfo.Abstract?.[0]?.AbstractText?.map(a => a._).join(" ") || "N/A",
            };
        }));

        // Step 4: Save results to output.json
        fs.writeFileSync("output.json", JSON.stringify(results, null, 4), "utf-8");
        console.log("File output.json saved successfully!");
        return results;
    } catch (error) {
        console.error("Error fetching data from PubMed:", error);
    }
}

// Example usage
fetchPubMedArticles('("disease" OR "Communicable disease" OR "Infectious disease" OR "Viral infectious diseases" OR "Bacterial infectious diseases" OR Dysentery OR "Parasitic diseases" OR "Malaria" OR "Schistosomiasis" OR "Dengue" OR "Zika" OR "Chikungunya" OR "Yellow Fever" OR "Mayaro" OR "Oropouche" OR "Common cold" OR "Pharyngitis" OR "Croup" OR "Acute laryngotracheitis" OR "Laryngitis" OR "Acute bronchitis" OR "Bronchiolitis" OR "Influenza-like illness" OR "Pneumonia" OR "Influenza") AND ("Climate" OR "Climate variability" OR "Climate change" OR "Meteorological variables" OR "Global warming" OR "Temperature" OR "Precipitation" OR "Rainfall" OR "Humidity" OR "Extreme weather" OR "Heat waves" OR "Floods" OR "Droughts" ) AND ("Data analysis" OR "Statistical analysis" OR "Data mining" OR "Machine learning" OR "Artificial intelligence" OR "AI" OR "Predictive modeling" OR "Forecasting" OR "Predictive analytics" OR "Time series analysis" OR "Deep learning" OR "Neural networks" OR "Big data" OR "Geospatial analysis" OR "Epidemiological modeling") AND (Brazil OR Latin America OR Tropical Weather OR Tropical Area)', 800);

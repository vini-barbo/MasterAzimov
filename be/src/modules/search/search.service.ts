import { Injectable } from '@nestjs/common';
import { PubmedService } from 'src/api/pubmed/pubmed.service';

@Injectable()
export class SearchService {
    constructor(private readonly pubmedService: PubmedService) { }

    async getQTDArticles() {
        return this.pubmedService.fetchArticles('("disease" OR "Communicable disease" OR "Infectious disease" OR "Viral infectious diseases" OR "Bacterial infectious diseases" OR Dysentery OR "Parasitic diseases" OR "Malaria" OR "Schistosomiasis" OR "Dengue" OR "Zika" OR "Chikungunya" OR "Yellow Fever" OR "Mayaro" OR "Oropouche" OR "Common cold" OR "Pharyngitis" OR "Croup" OR "Acute laryngotracheitis" OR "Laryngitis" OR "Acute bronchitis" OR "Bronchiolitis" OR "Influenza-like illness" OR "Pneumonia" OR "Influenza") AND ("Climate" OR "Climate variability" OR "Climate change" OR "Meteorological variables" OR "Global warming" OR "Temperature" OR "Precipitation" OR "Rainfall" OR "Humidity" OR "Extreme weather" OR "Heat waves" OR "Floods" OR "Droughts" ) AND ("Data analysis" OR "Statistical analysis" OR "Data mining" OR "Machine learning" OR "Artificial intelligence" OR "AI" OR "Predictive modeling" OR "Forecasting" OR "Predictive analytics" OR "Time series analysis" OR "Deep learning" OR "Neural networks" OR "Big data" OR "Geospatial analysis" OR "Epidemiological modeling") AND (Brazil OR Latin America OR Tropical Weather OR Tropical Area)')
    }
}

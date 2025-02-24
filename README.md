# Server start
Sample of data in the folder `public/data`
- The description of the dataset (drugs, side effects etc) should be described in the file `dataset_description.json`
- The example of data review presented in `results.csv`. For each review there drug, source, side effects and their categories should be described.

1. Initialize project

```bash
npm init -y
```

2. Install dependencies

```bash
npm install express papaparse cors
```

3. Start server

```bash
npm start
```

# Parser YouTube
First, you need two API-keys:
1. **YouTube Data API v3** - from Google Cloud Console 
2. **Searchapi API KEY** - from https://www.searchapi.io

Then make `config.yaml` file (example in `config-example`):
```yaml
YOUTUBE_API_KEY: "your_api_key"
SEARCH_API_KEY: "your_api_key"
```

Make sure that **file with drugs and their synonyms** exists. Example is in the `public/data/drugs.json`.

For youtube reveiws search use command:
```bash
    python parser.py  --config <path_to_config> --drugs <path_to_drugs_json> --output <path_to_output_file>
```

Example within this repo:
```bash
    python parser.py  --config config.yaml --drugs parser/data/drugs.json --output parser/data/youtube_results.csv
```
PROMPT = r"""App type: Dashboard.

Conventions:
- Framework: Streamlit. Entrypoint is app.py.
- Sidebar with at least one filter widget driving the main view.
- Include exactly one Plotly chart and one data table (st.dataframe).
- Ship a small sample CSV at data/sample.csv so the app runs out of the box.
- Load data with pandas; cache with @st.cache_data.

Example output for "A sales dashboard with region filter":
{"files":[{"path":"app.py","content":"import pandas as pd\nimport plotly.express as px\nimport streamlit as st\n\nst.set_page_config(page_title=\"Sales\", layout=\"wide\")\n\n@st.cache_data\ndef load() -> pd.DataFrame:\n    return pd.read_csv(\"data/sample.csv\", parse_dates=[\"date\"])\n\ndf = load()\nregions = sorted(df[\"region\"].unique())\nselected = st.sidebar.multiselect(\"Region\", regions, default=regions)\nfiltered = df[df[\"region\"].isin(selected)]\n\nst.title(\"Sales Dashboard\")\nfig = px.line(filtered, x=\"date\", y=\"revenue\", color=\"region\", title=\"Revenue over time\")\nst.plotly_chart(fig, use_container_width=True)\nst.dataframe(filtered, use_container_width=True)\n"},{"path":"data/sample.csv","content":"date,region,revenue\n2025-01-01,North,1200\n2025-01-01,South,980\n2025-02-01,North,1450\n2025-02-01,South,1100\n2025-03-01,North,1600\n2025-03-01,South,1320\n"}],"dependencies":["streamlit==1.40.1","pandas==2.2.3","plotly==5.24.1"],"readme":"# Sales Dashboard\n\nFilter sales by region and view revenue trends.\n\n## Quick Start\n\n```bash\npip install -r requirements.txt\nstreamlit run app.py\n```\n"}
"""

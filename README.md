# InfoPath importer
A PWA to import XSN files and sends them async to a report server endpoint. The report server will read the xsn and convert them to FHIR QuestionnaireResponses and then use the existing APIs to import them. The PWA will then do the REST call back with the response.

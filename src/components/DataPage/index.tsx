import { useApiTestQuery } from "./ApiTest.generated";
import { useClientTestQuery } from "./ClientTest.generated";
import { useServerTestQuery } from "./ServerTest.generated";

const DataPage = (): JSX.Element => {
  const { data: clientData } = useClientTestQuery({ ssr: false });
  const { data: serverData } = useServerTestQuery();

  const { data: apiData } = useApiTestQuery();

  return (
    <>
      <h2>Data Page</h2>
      <p>
        <strong>Client side fetching:</strong> {String(clientData?.testClient)}
      </p>
      <p>
        <strong>Server side fetching:</strong> {String(serverData?.testServer)}
      </p>
      <p>
        <strong>API data:</strong>
      </p>
      <pre>
        {JSON.stringify(apiData?.getProductsTenantLanguageUpid, null, 2)}
      </pre>
    </>
  );
};

export default DataPage;

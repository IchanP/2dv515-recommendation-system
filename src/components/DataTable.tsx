const DataTable = ({
  headers,
  data,
}: {
  headers: string[];
  data: Array<object>;
}) => {
  const backgroundRotator = (i: number) => {
    return i % 2 === 0
      ? "bg-lightPrimary dark:bg-darkPrimary"
      : "bg-lightSecondary dark:bg-darkSecondary";
  };
  let i = 0;
  return (
    <>
      <table>
        <thead className="w-full">
          <tr>
            {headers.map((header) => {
              const background = backgroundRotator(i);
              i++;
              return (
                <th key={header} className={background + " px-10 border-2"}>
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((object, index) => {
            return (
              <tr key={index}>
                {Object.values(object).map((data, i) => {
                  const background = backgroundRotator(i);
                  return (
                    <td key={i} className={`${background} px-10 border-2`}>
                      {data}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default DataTable;

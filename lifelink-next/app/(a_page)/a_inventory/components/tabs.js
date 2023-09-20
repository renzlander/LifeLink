import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
  } from "@material-tailwind/react";
  import { CurrentTable } from "./tableCurrent";
  import { ExpiredTable } from "./tableExpired";
   
  export function InventoryTabs() {
    const data = [
      {
        label: "Current",
        value: "curr",
        panel: <CurrentTable />,
      },
      {
        label: "Expired",
        value: "exp",
        panel: <ExpiredTable />,
      },
    ];
   
    return (
      <Tabs id="custom-animation" value="curr">
        <TabsHeader className="bg-gray-400 shadow-sm">
          {data.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          animate={{
            initial: { y: 250 },
            mount: { y: 0 },
            unmount: { y: 250 },
          }}
        >
          {data.map(({ value, panel }) => (
            <TabPanel key={value} value={value}>
              {panel}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    );
  }
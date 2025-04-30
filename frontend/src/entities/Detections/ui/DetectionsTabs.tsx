import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { DetectionForm } from "@/components/custom/DetectionForm.tsx";
import { DetectionsDataTable } from "@/entities/Detections";

export const DetectionsTabs = () => {
  return (
    <Tabs className="md:col-span-3" defaultValue="detection">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="detection">Обнаружение</TabsTrigger>
        <TabsTrigger value="history">История</TabsTrigger>
      </TabsList>
      <TabsContent value="detection">
        <Card>
          <CardHeader>
            <CardTitle>Обнаружение</CardTitle>
            <CardDescription>
              Загружайте изображения с лошадьми, чтобы обнаружить их.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DetectionForm />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>История обнаружений</CardTitle>
            <CardDescription>
              В этом разделе вы можете посмотреть историю
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DetectionsDataTable />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

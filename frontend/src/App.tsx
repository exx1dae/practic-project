import { ThemeSwitcher } from "@/components/mode-toggle.tsx";
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
import { DetectForm } from "@/components/custom/DetectForm.tsx";
import { EmptyStateMedia } from "@/components/custom/EmptyStateMedia.tsx";
import { DetectionsDataTable } from "@/entities/Detetctions";

export const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="grid grid-cols-5 gap-8 max-w-7xl w-full">
        <Tabs className="col-span-3" defaultValue="detection">
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
                <DetectForm />
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
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Превью результата обнаружения</CardTitle>
            <CardDescription>
              Ниже представлено результирующее изображение с обнаружением
              объектов
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyStateMedia />
          </CardContent>
        </Card>
      </div>
      <ThemeSwitcher className="absolute bottom-4 right-4" />
    </div>
  );
};

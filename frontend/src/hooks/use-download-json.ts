import { toast } from "sonner";

export const useDownloadJson = () => {
  const downloadJson = (data: unknown, fileName: string) => {
    try {
      if (!data) {
        throw new Error("No data to export");
      }

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Не удалось экспортировать результат");
      console.error("JSON export error:", error);
      throw error;
    }
  };

  return { downloadJson };
};

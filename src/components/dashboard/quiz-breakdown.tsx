import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChartComponent } from "./charts";

const QuizBreakdown = () => {

  const quizBreakdown = api.admin.quizBreakdown.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <BarChartComponent data={quizBreakdown.data} />
      </CardContent>
    </Card>
  );
};

export default QuizBreakdown;

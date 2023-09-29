import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Topics } from "@prisma/client";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TopicSkeleton } from "../loading-cards";
import TopicCard from "../cards/topic-card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

import { api } from "@/lib/api";
import { cleanEnum } from "@/lib/utils";
import AddSubtopicModal from "@/modals/AddSubtopic";
import RemoveSubtopicModal from "@/modals/RemoveSubtopic";

const AddTopics: React.FC = () => {
  const [topic, setTopic] = useState<Topics | null>(null);
  const { isLoading, data, isError, error } = api.meta.getSubtopics.useQuery(
    { topic },
    {
      enabled: !!topic,
    }
  );

  return (
    <div className="space-y-6 p-4">
      <Select onValueChange={(val) => setTopic(val as Topics)}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Topic" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(Topics).map((topic) => (
            <SelectItem key={topic} value={topic}>
              {cleanEnum(topic)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isError && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Uh oh, something went wrong!</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <div className="grid w-full grid-cols-5 gap-4 rounded-lg p-4">
        {isLoading &&
          new Array(10).fill(0).map((_, i) => <TopicSkeleton key={i} />)}
        {!isLoading && <AddSubtopicModal topic={topic} />}
        {!!data &&
          data.map((subtopic) => (
            <TopicCard
              key={subtopic}
              title={subtopic}
              actionComponent={
                <RemoveSubtopicModal topic={topic} subtopic={subtopic} />
              }
            />
          ))}
      </div>
    </div>
  );
};

export default AddTopics;

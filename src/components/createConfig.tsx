import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

const diffuculty = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

export function CreateConfig() {
  const [type, setType] = useState("easy");
  const [numQuestions, setNumQuestions] = useState(10);

  return (
    <div className="flex  shrink-0 items-center justify-center rounded-md border border-dashed">
      <ScrollArea className="h-fit w-full">
        <CardHeader>
          <CardTitle>Lets build your exam</CardTitle>
          <CardDescription>
            What area are you having problems with?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="area">Difficulty</Label>
              <Select defaultValue={type}>
                <SelectTrigger id="area">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {diffuculty.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      onClick={() => setType(item.value)}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="text">University</Label>
              <Input id="university" placeholder="Brown University" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">{numQuestions} Questions</Label>
            <Slider
              defaultValue={[numQuestions]}
              max={50}
              step={1}
              onValueChange={(value) => setNumQuestions(value[0] as number)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="items-top flex space-x-2">
                <Checkbox id="terms1" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Multiple Choice
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Multiple choice questions with 4 options
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="items-top flex space-x-2">
                <Checkbox id="terms1" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Short Answer
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Short answer questions with 1-2 sentences
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="items-top flex space-x-2">
                <Checkbox id="terms1" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    True/False
                  </label>
                  <p className="text-sm text-muted-foreground">
                    True or false questions
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="items-top flex space-x-2">
                <Checkbox id="terms1" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Matching
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Match the correct answer to the question
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="w-full">
              <Label htmlFor="description">Notes</Label>
            </div>
            <Textarea id="description" placeholder="Hey, I need help with..." />
          </div>
        </CardContent>
        <CardFooter className="justify-between space-x-2">
          <Button className="w-full" variant="default">
            Submit (2 credits)
          </Button>
        </CardFooter>
      </ScrollArea>
    </div>
  );
}

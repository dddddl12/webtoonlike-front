import { useTranslations } from "next-intl";
import { Gap, Row } from "@/shadcn/ui/layouts";
import { Button } from "@/shadcn/ui/button";
import { IconCross } from "@/components/svgs/IconCross";
import { Text } from "@/shadcn/ui/texts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shadcn/ui/select";
import { IconDelete } from "@/components/svgs/IconDelete";
import { UseFormReturn, useWatch } from "react-hook-form";
import { BidRoundFormT, ContractRangeItemSchema, ContractRangeItemT } from "@/resources/bidRounds/bidRound.types";
import { FormControl, FormField, FormItem } from "@/shadcn/ui/form";

export default function BidRoundFormContractRange({ form }: {
  form: UseFormReturn<BidRoundFormT>;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");

  const contractRange = useWatch({
    control: form.control,
    name: "contractRange"
  });

  return (
    <div>
      <Row className="justify-end">
        <Button className="bg-mint w-[120px]" onClick={(e) => {
          e.preventDefault();
          const newContractRange = form.getValues("contractRange") || [];
          newContractRange.push({} as any);
          form.setValue("contractRange", newContractRange);
        }}>
          <IconCross className="fill-white" />
          <Text className="text-white">{t("addItem")}</Text>
        </Button>
      </Row>
      <Gap y={3} />
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-dark">
            {[
              "typeOfBusinessRight",
              "businessRightClassification",
              "exclusiveRights",
              "serviceRegion",
              "delete"
            ].map((key) => (
              <TableHead key={key} className="text-center text-gray-text">
                {t(key)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {contractRange && contractRange.map((row, idx) => (
            <TableRow key={idx}>
              <BusinessRightCell form={form} row={row} idx={idx} />
              <BusinessFieldCell form={form} row={row} idx={idx} />
              <ExclusiveCell form={form} idx={idx} />
              <CountryCell form={form} idx={idx} />
              <DeleteCell form={form} idx={idx} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function BusinessRightCell({ form, row, idx }: {
  form: UseFormReturn<BidRoundFormT>;
  row: ContractRangeItemT;
  idx: number;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  const items = [
    {
      value: "webtoons",
      label: t("webtoonSerialRights"),
    },
    {
      value: "secondary",
      label: t("secondBusinessRight"),
    }
  ];

  let defaultValue;
  if (row.businessField === "WEBTOONS") {
    defaultValue = items[0].value;
  } else if (row.businessField) {
    defaultValue = items[1].value;
  }

  return <TableCell className="text-center w-[200px]">
    <Select
      defaultValue={defaultValue}
      onValueChange={(value) => {
        if (value === items[0].value) {
          form.setValue(`contractRange.${idx}.businessField`, "WEBTOONS");
        } else if (row.businessField === "WEBTOONS"){
          form.setValue(`contractRange.${idx}.businessField`, undefined as any);
        }
      }}
    >
      <SelectTrigger className="bg-gray-darker rounded-sm">
        {/* todo placeholder 명시적으로 드러나지 않음*/}
        <SelectValue placeholder={t("selectTypeOfBusinessRight")} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => {
          return <SelectItem value={item.value} key={item.value}>
            {item.label}
          </SelectItem>;
        })}
      </SelectContent>
    </Select>
  </TableCell>;
}

function BusinessFieldCell({ form, row, idx }: {
  form: UseFormReturn<BidRoundFormT>;
  row: ContractRangeItemT;
  idx: number;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  const tBusinessFields = useTranslations("businessFields");
  if (row.businessField === "WEBTOONS") {
    return <TableCell className="text-center w-[200px]">
      <Text>-</Text>
    </TableCell>;
  }
  return <TableCell className="text-center w-[200px]">
    <FormField
      control={form.control}
      name={`contractRange.${idx}.businessField`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select
              defaultValue={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="bg-gray-darker rounded-sm">
                <SelectValue
                  placeholder={t("selectBusinessRightClassifications")}
                />
              </SelectTrigger>
              <SelectContent>
                {ContractRangeItemSchema.shape.businessField
                  .exclude(["WEBTOONS"])
                  .options.map((value) => {
                    return <SelectItem value={value} key={value}>
                      {tBusinessFields(value)}
                    </SelectItem>;
                  })}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  </TableCell>;
}

function ExclusiveCell({ form, idx }: {
  form: UseFormReturn<BidRoundFormT>;
  idx: number;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  const tContractType = useTranslations("contractType");
  return <TableCell className="text-center w-[200px]">
    <FormField
      control={form.control}
      name={`contractRange.${idx}.contract`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select
              defaultValue={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="bg-gray-darker rounded-sm">
                <SelectValue
                  placeholder={t("exclusiveRights")}
                />
              </SelectTrigger>
              <SelectContent>
                {ContractRangeItemSchema.shape.contract
                  .options.map((value) => {
                    return <SelectItem value={value} key={value}>
                      {tContractType(value)}
                    </SelectItem>;
                  })}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  </TableCell>;
}

function CountryCell({ form, idx }: {
  form: UseFormReturn<BidRoundFormT>;
  idx: number;
}) {
  const t = useTranslations("updateOrCreateBidRoundsPage");
  const tCountry = useTranslations("countries");

  return <TableCell className="text-center w-[200px]">
    <FormField
      control={form.control}
      name={`contractRange.${idx}.country`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select
              defaultValue={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="bg-gray-darker rounded-sm">
                <SelectValue
                  placeholder={t("serviceRegion")}
                />
              </SelectTrigger>
              <SelectContent>
                {ContractRangeItemSchema.shape.country
                  .options.map((value) => {
                    return <SelectItem value={value} key={value}>
                      {tCountry(value)}
                    </SelectItem>;
                  })}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  </TableCell>;
}

function DeleteCell({ form, idx }: {
  form: UseFormReturn<BidRoundFormT>;
  idx: number;
}) {
  return <TableCell className="text-center w-[50px]">
    <Button
      className="bg-red text-white hover:bg-red/70"
      onClick={(e) => {
        e.preventDefault();
        const newContractRange = form.getValues("contractRange");
        newContractRange.splice(idx, 1);
        form.setValue("contractRange", newContractRange);
      }}
    >
      <IconDelete className="fill-white" />
    </Button>
  </TableCell>;
}
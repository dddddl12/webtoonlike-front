import { useTranslations } from "next-intl";
import { Row } from "@/components/ui/common";
import { Button } from "@/shadcn/ui/button";
import { IconCross } from "@/components/svgs/IconCross";
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
import { BidRoundFormT, ContractRangeItemSchema, ContractRangeItemT } from "@/resources/bidRounds/dtos/bidRound.dto";
import { FormControl, FormField, FormItem } from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { OfferProposalFormT } from "@/resources/offers/dtos/offerProposal.dto";

type FormT = BidRoundFormT | OfferProposalFormT;

export default function ContractRangeForm({ form, formType }: {
  form: UseFormReturn<FormT>;
  formType: "bidRound" | "offerProposal";
}) {
  const t = useTranslations("contractRangeDataForm");

  const contractRange = useWatch({
    control: form.control,
    name: "contractRange"
  });

  return (
    <div>
      <Row className="justify-end">
        <Button variant="mint" onClick={(e) => {
          e.preventDefault();
          const newContractRange = form.getValues("contractRange") || [];
          newContractRange.push({} as any); //todo
          form.setValue("contractRange", newContractRange, {
            shouldValidate: true
          });
        }}>
          <IconCross/>
          <span>{t("addItem")}</span>
        </Button>
      </Row>
      <Table className="mt-3">
        <TableHeader>
          <TableRow className="bg-gray-dark">
            <TableHead className="text-center text-gray-text">
              {t("typeOfBusinessRight")}
            </TableHead>
            <TableHead className="text-center text-gray-text">
              {t("businessRightClassification")}
            </TableHead>
            <TableHead className="text-center text-gray-text">
              {t("exclusiveRights")}
            </TableHead>
            <TableHead className="text-center text-gray-text">
              {t("serviceRegion")}
            </TableHead>
            {formType === "offerProposal"
              // 오퍼 폼일 때만 사용하는 컬럼
              && <TableHead className="text-center text-gray-text">
                {t("contractCondition")}
              </TableHead>}
            <TableHead className="text-center text-gray-text">
              {t("delete")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contractRange && contractRange.map((row, idx) => (
            <TableRow key={idx}>
              <BusinessRightCell form={form} row={row} idx={idx} />
              <BusinessFieldCell form={form} row={row} idx={idx} />
              <ExclusiveCell form={form} idx={idx} />
              <CountryCell form={form} idx={idx} />

              {formType === "offerProposal"
              // 오퍼 폼일 때만 사용하는 컬럼
              && <ContractConditionCell form={form as UseFormReturn<OfferProposalFormT>} idx={idx} />}

              <DeleteCell form={form} idx={idx} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function BusinessRightCell({ form, row, idx }: {
  form: UseFormReturn<FormT>;
  row: ContractRangeItemT;
  idx: number;
}) {
  const t = useTranslations("contractRangeDataForm");
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
          form.setValue(`contractRange.${idx}.businessField`, "WEBTOONS", {
            shouldValidate: true
          });
        } else if (row.businessField === "WEBTOONS"){
          form.setValue(`contractRange.${idx}.businessField`, undefined as any, {
            shouldValidate: true
          });
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
  form: UseFormReturn<FormT>;
  row: ContractRangeItemT;
  idx: number;
}) {
  const t = useTranslations("contractRangeDataForm");
  const tBusinessFields = useTranslations("businessFields");
  if (row.businessField === "WEBTOONS") {
    return <TableCell className="text-center w-[200px]">
      -
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
  form: UseFormReturn<FormT>;
  idx: number;
}) {
  const t = useTranslations("contractRangeDataForm");
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
  form: UseFormReturn<FormT>;
  idx: number;
}) {
  const t = useTranslations("contractRangeDataForm");
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

// OfferProposalForm에만 사용
function ContractConditionCell({ form, idx }: {
  form: UseFormReturn<OfferProposalFormT>;
  idx: number;
}) {
  const t = useTranslations("contractRangeDataForm");
  return <TableCell className="text-center w-[200px]">
    <FormField
      control={form.control}
      name={`contractRange.${idx}.message`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              {...field}
              value={field.value || ""}
              type="text"
              placeholder={t("contractConditionDesc")}
            />
          </FormControl>
        </FormItem>
      )}
    />
  </TableCell>;
}

function DeleteCell({ form, idx }: {
  form: UseFormReturn<FormT>;
  idx: number;
}) {
  return <TableCell className="text-center w-[50px]">
    <Button
      className="bg-red text-white hover:bg-red/70"
      onClick={(e) => {
        e.preventDefault();
        const newContractRange = form.getValues("contractRange");
        newContractRange.splice(idx, 1);
        form.setValue("contractRange", newContractRange, {
          shouldValidate: true
        });
      }}
    >
      <IconDelete className="fill-white" />
    </Button>
  </TableCell>;
}
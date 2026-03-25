import { REPORT_TYPES } from "../../../../contants";
import { buildReportsResponse } from "./report-fetch.utils";

const buildComment = (
    unitId: number,
    recipientUnitId: number,
    text: string
) => ({
    dataValues: {
        unitId,
        recipientUnitId,
        text,
    },
});

const buildUnitAssociation = (id: number, description: string) => ({
    details: [{
        unitId: id,
        description,
        unitLevelId: 1,
        tsavIrgunCodeId: String(id),
    }],
    unitStatus: [{
        unitStatus: {
            id: 1,
            description: "בדיווח",
        },
    }],
});

describe("buildReportsResponse", () => {
    it("excludes the screen unit from items and returns its comment in comments", () => {
        const data = buildReportsResponse({
            recipientUnitId: 35,
            reports: [{
                unitId: 35,
                recipientUnitId: 35,
                reportTypeId: REPORT_TYPES.USAGE,
                unit: buildUnitAssociation(35, "Unit 35"),
                recipientUnit: buildUnitAssociation(35, "Unit 35"),
                items: [{
                    materialId: "M0000001",
                    confirmedQuantity: 2,
                    status: "ACTIVE",
                    material: {
                        id: "M0000001",
                        comments: [
                            buildComment(35, 35, "screen unit comment"),
                        ],
                    },
                }],
            }] as any,
        });

        expect(data).toEqual([{
            material: {
                id: "M0000001",
                description: "",
                multiply: 0,
                nickname: "",
                category: "",
                unitOfMeasure: "",
            },
            comments: [{
                type: REPORT_TYPES.USAGE,
                comment: "screen unit comment",
            }],
            allocatedQuantity: null,
            items: [],
        }]);
    });

    it("keeps child unit rows in items", () => {
        const data = buildReportsResponse({
            recipientUnitId: 35,
            reports: [{
                unitId: 100,
                recipientUnitId: 35,
                reportTypeId: REPORT_TYPES.USAGE,
                unit: buildUnitAssociation(100, "Unit 100"),
                recipientUnit: buildUnitAssociation(35, "Unit 35"),
                items: [{
                    materialId: "M0000001",
                    confirmedQuantity: 2,
                    status: "ACTIVE",
                    material: {
                        id: "M0000001",
                        comments: [
                            buildComment(100, 35, "child comment"),
                        ],
                    },
                }],
            }] as any,
        });

        expect(data).toHaveLength(1);
        expect(data[0].comments).toEqual([]);
        expect(data[0].items).toHaveLength(1);
        expect(data[0].items[0].unit.id).toBe(100);
        expect(data[0].items[0].types[0].comment).toBe("child comment");
    });
});

// Code generated with the assistance of GPT-4
import { readFileSync } from 'fs'

type Range = [number, number];
type AttributeRanges = { x: Range, m: Range, a: Range, s: Range };
type RangeSet = AttributeRanges[];
type WorkflowRule = [string | null, string];
type Workflow = { [key: string]: WorkflowRule[] };


const content = readFileSync('input19.txt', 'utf8')
let workflows = parseWorkflowsString(content)

let initialRangeSet: RangeSet = [{
    x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000]
}];

let accepted = processRangeSetThroughWorkflow(initialRangeSet, workflows['in'], workflows);
const totalPossibilities = calculateTotalCombinations(accepted);
console.log('Total possibilities:', totalPossibilities);


function processRangeSetThroughWorkflow(initialRangeSet: RangeSet, initialWorkflow: WorkflowRule[], workflows: Workflow): RangeSet {
    const acceptedRangeSet: RangeSet = [];
    let processingStack: { rangeSet: RangeSet, workflow: WorkflowRule[] }[] = [{ rangeSet: initialRangeSet, workflow: initialWorkflow }];

    while (processingStack.length > 0) {
        const { rangeSet, workflow } = processingStack.pop()!;
        for (const rule of workflow) {
            if (!processStep(rule, rangeSet, acceptedRangeSet, workflows, processingStack)) {
                break;
            }
        }
    }
    return acceptedRangeSet;
}

function processStep(rule: WorkflowRule, rangeSet: RangeSet, acceptedRangeSet: RangeSet, workflows: Workflow, processingStack: { rangeSet: RangeSet, workflow: WorkflowRule[] }[]): boolean {
    const [condition, action] = rule
    if (condition === null) {
        if (action === 'A') acceptedRangeSet.push(...rangeSet);
        else if (workflows[action]) processingStack.push({ rangeSet, workflow: workflows[action] });

        return false;
    }

    const [below, above] = splitRangeSet(rangeSet, condition);
    const targetRangeSet = condition.charAt(1) === '<' ? below : above;

    if (action === 'A') acceptedRangeSet.push(...targetRangeSet);
    else if (workflows[action]) processingStack.push({ rangeSet: targetRangeSet, workflow: workflows[action] });

    rangeSet.splice(0, rangeSet.length, ...(condition.charAt(1) === '<' ? above : below));
    return true;
}


function splitRangeSet(rangeSet: RangeSet, condition: string): [RangeSet, RangeSet] {
    const variable = condition.charAt(0) as keyof AttributeRanges;
    const threshold = parseInt(condition.substring(2));
    const isLessThan = condition.charAt(1) === '<';

    const belowThreshold: RangeSet = [];
    const aboveThreshold: RangeSet = [];

    rangeSet.forEach(ranges => {
        const currentRange = ranges[variable];
        const [lower, upper] = currentRange;

        if (isLessThan && upper < threshold || !isLessThan && lower > threshold) {
            (isLessThan ? belowThreshold : aboveThreshold).push(ranges);
        } else if (isLessThan && lower >= threshold || !isLessThan && upper <= threshold) {
            (isLessThan ? aboveThreshold : belowThreshold).push(ranges);
        } else {
            // Split the range
            belowThreshold.push({ ...ranges, [variable]: isLessThan ? [lower, threshold - 1] : [lower, threshold] });
            aboveThreshold.push({ ...ranges, [variable]: isLessThan ? [threshold, upper] : [threshold + 1, upper] });
        }
    });

    return [belowThreshold, aboveThreshold];
}

function parseWorkflowsString(workflowsStr: string): Workflow {
    const workflows: Workflow = {};
    const workflowsList = workflowsStr.split('\n');

    workflowsList.forEach(workflow => {
        const [name, rulesStr] = workflow.split('{');
        const rules = rulesStr.slice(0, -1).split(',');

        const parsedRules: WorkflowRule[] = rules.map(rule => {
            if (rule.includes(':')) {
                const [condition, action] = rule.split(':');
                return [condition, action];
            } else {
                return [null, rule];
            }
        });

        workflows[name.trim()] = parsedRules;
    });

    return workflows;
}

function calculateTotalCombinations(rangeSet: RangeSet): number {
    let totalCombinations = 0;

    rangeSet.forEach(ranges => {
        // Calculate the number of possibilities for each AttributeRanges object
        let combinationsForSet = 1;
        Object.keys(ranges).forEach(key => {
            const range = ranges[key as keyof AttributeRanges];
            combinationsForSet *= (range[1] - range[0] + 1); // Range is inclusive
        });

        // Add the combinations for this set to the total
        totalCombinations += combinationsForSet;
    });

    return totalCombinations;
}


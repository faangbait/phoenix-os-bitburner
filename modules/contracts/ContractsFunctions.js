import { FindLPF } from "coding_contracts/find_lpf";
import { SubarrayMaxSum } from "coding_contracts/subarray_max_sum";
import { TotalWaysToSum } from "coding_contracts/total_ways_to_sum_1";
import { TotalWaysToSum2 } from "coding_contracts/total_ways_to_sum_2";
import { SpiralizeMatrix } from "coding_contracts/spiralize_matrix";
import { ArrayJumping1 } from "coding_contracts/array_jumping";
import { ArrayJumping2 } from "coding_contracts/array_jumping";
import { MergeOverlapping } from "coding_contracts/merge_overlapping";
import { GenerateIP } from "coding_contracts/generate_ip";
import { StockTrader1, StockTrader2, StockTrader3, StockTrader4 } from "coding_contracts/stock_trader_universal";
import { MinPathSumTriangle } from "coding_contracts/min_path_sum_triangle";
import { UniquePathsGrid1 } from "coding_contracts/unique_paths_grid_1";
import { UniquePathsGrid2 } from "coding_contracts/unique_paths_grid_2";
import { ShortestPathGrid } from "coding_contracts/shortest_path_grid";
import { SanitizeParens } from "coding_contracts/sanitize_parens";
import { FindValidMath } from "coding_contracts/find_valid_math_expr";
import { HammingEncode } from "coding_contracts/hammingcodes_encode";
import { HammingDecode } from "coding_contracts/hammingcodes_error";
import { TwoColoringGraph } from "coding_contracts/two_coloring_graph";
import { RLECompression } from "coding_contracts/compression_1";
import { LZDecompression } from "coding_contracts/compression_2";
import { LZCompression } from "coding_contracts/compression_3";
export const attemptContract = (type, data) => {
    switch (type) {
        case "Find Largest Prime Factor":
            return FindLPF.answer(data);
        case "Subarray with Maximum Sum":
            return SubarrayMaxSum.answer(data);
        case "Total Ways to Sum":
            return TotalWaysToSum.answer(data);
        case "Total Ways to Sum II":
            return TotalWaysToSum2.answer(data);
        case "Spiralize Matrix":
            return SpiralizeMatrix.answer(data);
        case "Array Jumping Game":
            return ArrayJumping1.answer(data);
        case "Array Jumping Game II":
            return ArrayJumping2.answer(data);
        case "Merge Overlapping Intervals":
            return MergeOverlapping.answer(data);
        case "Generate IP Addresses":
            return GenerateIP.answer(data);
        case "Algorithmic Stock Trader I":
            return StockTrader1.answer(data);
        case "Algorithmic Stock Trader II":
            return StockTrader2.answer(data);
        case "Algorithmic Stock Trader III":
            return StockTrader3.answer(data);
        case "Algorithmic Stock Trader IV":
            return StockTrader4.answer(data);
        case "Minimum Path Sum in a Triangle":
            return MinPathSumTriangle.answer(data);
        case "Unique Paths in a Grid I":
            return UniquePathsGrid1.answer(data);
        case "Unique Paths in a Grid II":
            return UniquePathsGrid2.answer(data);
        case "Shortest Path in a Grid":
            return ShortestPathGrid.answer(data);
        case "Sanitize Parentheses in Expression":
            return SanitizeParens.answer(data);
        case "Find All Valid Math Expressions":
            return FindValidMath.answer(data);
        case "HammingCodes: Integer to Encoded Binary":
            return HammingEncode.answer(data);
        case "HammingCodes: Encoded Binary to Integer":
            return HammingDecode.answer(data);
        case "Proper 2-Coloring of a Graph":
            return TwoColoringGraph.answer(data);
        case "Compression I: RLE Compression":
            return RLECompression.answer(data);
        case "Compression II: LZ Decompression":
            return LZDecompression.answer(data);
        case "Compression III: LZ Compression":
            return LZCompression.answer(data);
        default:
            return null;
    }
};

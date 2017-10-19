package util;

import bean.Cell;
import bean.GPS;

import java.util.ArrayList;
import java.util.List;

/**
 * GridUtil mainly used for pre-process GPS,
 * specifically gridding the GPS point.
 *
 * @author Bin Cheng
 */
public class GridUtil {

    /**
     * Convert GPS Sequence into a tile Sequence,
     * through method of the Mercator projection mentioned in util.TileSystem.
     *
     * @param gpsList GPS Sequence
     * @return tile Sequence
     */
    public static List<Cell> gridGPSSequence(List<GPS> gpsList) {

        List<Cell> cellList = new ArrayList<>();
        if (gpsList == null || gpsList.size() == 0)
            return cellList;

        Cell lastCell = TileSystem.GPSToTile(gpsList.get(0));
        cellList.add(lastCell);
        //TODO 可能存在漂移的点，需要过滤掉
        for (int i = 1; i < gpsList.size(); i++) {
            Cell currentCell = TileSystem.GPSToTile(gpsList.get(i));
            //cellList should't have duplicate tiles
            if (!lastCell.equals(currentCell)) {
//                if (!isTilesAdjacent(lastCell, currentCell)) {
                cellList.addAll(addVirtualTiles(lastCell, currentCell));
//                }
//                cellList.add(currentCell);
            }

            lastCell = currentCell;
        }
        return cellList;
    }

    /**
     * Two title in the title sequence may not be adjacent,
     * in order to make the title sequence continues,
     * this method will add virtual tile points between start title and end title.
     *
     * @param startCell the start tile
     * @param endCell   the end tile
     * @return the virtual tiles that between start tile and end tile, included end tile
     */
    private static List<Cell> addVirtualTiles(Cell startCell, Cell endCell) {

        List<Cell> virtualList = new ArrayList<>();
        int tmpX = startCell.getTileX();
        int tmpY = startCell.getTileY();
        int endX = endCell.getTileX();
        int endY = endCell.getTileY();
        while (tmpX != endX || tmpY != endY) {
            int gradientX = endX - tmpX;
            int gradientY = endY - tmpY;
            if (gradientX > 0)
                tmpX++;
            else if (gradientX < 0)
                tmpX--;
            if (gradientY > 0)
                tmpY++;
            else if (gradientY < 0)
                tmpY--;
            virtualList.add(new Cell(tmpX, tmpY));
        }
        return virtualList;
    }

//    private static boolean isTilesAdjacent(Cell lastTile, Cell currentTile) {
//        return Math.abs(lastTile.getTileX() - currentTile.getTileX()) <= 1
//                || Math.abs(lastTile.getTileY() - currentTile.getTileY()) <= 1;
//    }

//    public static void main(String[] args) {
//        System.out.println(addVirtualTiles(new Cell(1, 1), new Cell(1, 1)).toString());
//        System.out.println(addVirtualTiles(new Cell(1, 1), new Cell(1, 4)).toString());
//        System.out.println(addVirtualTiles(new Cell(1, 1), new Cell(5, 7)).toString());
//        System.out.println(addVirtualTiles(new Cell(7, 7), new Cell(4, 4)).toString());
//        System.out.println(addVirtualTiles(new Cell(7, 1), new Cell(4, 4)).toString());
//        System.out.println(addVirtualTiles(new Cell(1, 6), new Cell(7, 6)).toString());
//    }
}

echo "Running: ./se2417 logout"
./se2417 logout
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 login --username admin --passw freepasses4all"
./se2417 login --username admin --passw freepasses4all
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 healthcheck"
./se2417 healthcheck
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 resetpasses"
./se2417 resetpasses
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 healthcheck"
./se2417 healthcheck
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 resetstations"
./se2417 resetstations
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 healthcheck"
./se2417 healthcheck
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 admin --addpasses --source passes17.csv"
./se2417 admin --addpasses --source passes17.csv
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 healthcheck"
./se2417 healthcheck
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 tollstationpasses --station AM08 --from 20220315 --to 20220329 --format json --beautify"
./se2417 tollstationpasses --station AM08 --from 20220315 --to 20220329 --format json --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 tollstationpasses --station NAO04 --from 20220315 --to 20220329 --format csv --beautify"
./se2417 tollstationpasses --station NAO04 --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 tollstationpasses --station NO01 --from 20220315 --to 20220329 --format csv --beautify"
./se2417 tollstationpasses --station NO01 --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 tollstationpasses --station OO03 --from 20220315 --to 20220329 --format csv --beautify"
./se2417 tollstationpasses --station OO03 --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 tollstationpasses --station XXX --from 20220315 --to 20220329 --format csv --beautify"
./se2417 tollstationpasses --station XXX --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 tollstationpasses --station OO03 --from 20220315 --to 20220329 --format YYY --beautify"
./se2417 tollstationpasses --station OO03 --from 20220315 --to 20220329 --format YYY --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 errorparam --station OO03 --from 20220315 --to 20220329 --format csv --beautify"
./se2417 errorparam --station OO03 --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 tollstationpasses --station AM08 --from 20220316 --to 20220327 --format json --beautify"
./se2417 tollstationpasses --station AM08 --from 20220316 --to 20220327 --format json --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 tollstationpasses --station NAO04 --from 20220316 --to 20220327 --format csv --beautify"
./se2417 tollstationpasses --station NAO04 --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 tollstationpasses --station NO01 --from 20220316 --to 20220327 --format csv --beautify"
./se2417 tollstationpasses --station NO01 --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 tollstationpasses --station OO03 --from 20220316 --to 20220327 --format csv --beautify"
./se2417 tollstationpasses --station OO03 --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 tollstationpasses --station XXX --from 20220316 --to 20220327 --format csv --beautify"
./se2417 tollstationpasses --station XXX --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 tollstationpasses --station OO03 --from 20220316 --to 20220327 --format YYY --beautify"
./se2417 tollstationpasses --station OO03 --from 20220316 --to 20220327 --format YYY --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passanalysis --stationop AM --tagop NAO --from 20220315 --to 20220329 --format json --beautify"
./se2417 passanalysis --stationop AM --tagop NAO --from 20220315 --to 20220329 --format json --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passanalysis --stationop NAO --tagop AM --from 20220315 --to 20220329 --format csv --beautify"
./se2417 passanalysis --stationop NAO --tagop AM --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passanalysis --stationop NO --tagop OO --from 20220315 --to 20220329 --format csv --beautify"
./se2417 passanalysis --stationop NO --tagop OO --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passanalysis --stationop OO --tagop KO --from 20220315 --to 20220329 --format csv --beautify"
./se2417 passanalysis --stationop OO --tagop KO --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passanalysis --stationop XXX --tagop KO --from 20220315 --to 20220329 --format csv --beautify"
./se2417 passanalysis --stationop XXX --tagop KO --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passanalysis --stationop AM --tagop NAO --from 20220316 --to 20220327 --format json --beautify"
./se2417 passanalysis --stationop AM --tagop NAO --from 20220316 --to 20220327 --format json --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passanalysis --stationop NAO --tagop AM --from 20220316 --to 20220327 --format csv --beautify"
./se2417 passanalysis --stationop NAO --tagop AM --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passanalysis --stationop NO --tagop OO --from 20220316 --to 20220327 --format csv --beautify"
./se2417 passanalysis --stationop NO --tagop OO --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passanalysis --stationop OO --tagop KO --from 20220316 --to 20220327 --format csv --beautify"
./se2417 passanalysis --stationop OO --tagop KO --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passanalysis --stationop XXX --tagop KO --from 20220316 --to 20220327 --format csv --beautify"
./se2417 passanalysis --stationop XXX --tagop KO --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passescost --stationop AM --tagop NAO --from 20220315 --to 20220329 --format json --beautify"
./se2417 passescost --stationop AM --tagop NAO --from 20220315 --to 20220329 --format json --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passescost --stationop NAO --tagop AM --from 20220315 --to 20220329 --format csv --beautify"
./se2417 passescost --stationop NAO --tagop AM --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passescost --stationop NO --tagop OO --from 20220315 --to 20220329 --format csv --beautify"
./se2417 passescost --stationop NO --tagop OO --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passescost --stationop OO --tagop KO --from 20220315 --to 20220329 --format csv --beautify"
./se2417 passescost --stationop OO --tagop KO --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passescost --stationop XXX --tagop KO --from 20220315 --to 20220329 --format csv --beautify"
./se2417 passescost --stationop XXX --tagop KO --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passescost --stationop AM --tagop NAO --from 20220316 --to 20220327 --format json --beautify"
./se2417 passescost --stationop AM --tagop NAO --from 20220316 --to 20220327 --format json --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passescost --stationop NAO --tagop AM --from 20220316 --to 20220327 --format csv --beautify"
./se2417 passescost --stationop NAO --tagop AM --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passescost --stationop NO --tagop OO --from 20220316 --to 20220327 --format csv --beautify"
./se2417 passescost --stationop NO --tagop OO --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passescost --stationop OO --tagop KO --from 20220316 --to 20220327 --format csv --beautify"
./se2417 passescost --stationop OO --tagop KO --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 passescost --stationop XXX --tagop KO --from 20220316 --to 20220327 --format csv --beautify"
./se2417 passescost --stationop XXX --tagop KO --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 chargesby --opid NAO --from 20220315 --to 20220329 --format json --beautify"
./se2417 chargesby --opid NAO --from 20220315 --to 20220329 --format json --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 chargesby --opid GE --from 20220315 --to 20220329 --format csv --beautify"
./se2417 chargesby --opid GE --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 chargesby --opid OO --from 20220315 --to 20220329 --format csv --beautify"
./se2417 chargesby --opid OO --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 chargesby --opid KO --from 20220315 --to 20220329 --format csv --beautify"
./se2417 chargesby --opid KO --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 chargesby --opid NO --from 20220315 --to 20220329 --format csv --beautify"
./se2417 chargesby --opid NO --from 20220315 --to 20220329 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 chargesby --opid NAO --from 20220316 --to 20220327 --format json --beautify"
./se2417 chargesby --opid NAO --from 20220316 --to 20220327 --format json --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 chargesby --opid GE --from 20220316 --to 20220327 --format csv --beautify"
./se2417 chargesby --opid GE --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 chargesby --opid OO --from 20220316 --to 20220327 --format csv --beautify"
./se2417 chargesby --opid OO --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 chargesby --opid KO --from 20220316 --to 20220327 --format csv --beautify"
./se2417 chargesby --opid KO --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo
echo "Running: ./se2417 chargesby --opid NO --from 20220316 --to 20220327 --format csv --beautify"
./se2417 chargesby --opid NO --from 20220316 --to 20220327 --format csv --beautify
read -p "Press any key to resume..."
echo

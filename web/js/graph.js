window.onload = function() {
    var canvas,
        ctx,
        nodes = [],
        dragNode,
        dragPoint,
        lastMousePosition,
        path = [],
        deepRecursive;

    canvas = document.getElementById('viewport');
    ctx = canvas.getContext('2d');

    $("button[name='connectBtn']").on("click", function () {
        $.ajax({
            url: "/site/save-links",
            type: "POST",
            data: {
                "a-node": $("#a-node-connect").val(),
                "b-node": $("#b-node-connect").val(),
                "weight": $("#weight").val()
            }
        }).success(function () {
            console.log(123);
            getDataFromDataBase();
            render();
        });
    });

    $("button[name='addBtn']").on("click", function () {
        $.ajax({
            url: "/site/add-nodes",
            type: "POST",
            data: {
                "x": lastMousePosition === undefined ? 50 : lastMousePosition.x,
                "y": lastMousePosition === undefined ? 50 : lastMousePosition.y
            }
        }).success(function () {
            getDataFromDataBase();
            render();
        });
    });

    $("button[name='deleteBtn']").on("click", function () {
        $.ajax({
            url: "/site/delete-nodes",
            type: "POST",
            data: {
                "node": $("#node-delete").val(),
            }
        }).success(function () {
            getDataFromDataBase();
            render();
        });
    });

    $("button[name='pathBtn']").on("click", function () {
        getShrotPath(
            parseInt($("#a-node-path").val()),
            parseInt($("#b-node-path").val()));
    });

    /**
     * Отрисовка связей
     *
     * @param link - массив связей
     */
    drawText = function (link) {
        nodeA = getNodeById(link.id_a);
        nodeB = getNodeById(link.id_b);

        ctx.font = "italic small-caps bold 11px Arial";
        ctx.fillStyle = "#1919d0";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        weightAB = parseInt(link.weight_ab);
        if (weightAB === -1) {
            weightAB = Math.floor(Math.sqrt(Math.pow(nodeA.x * 1 - nodeB.x * 1, 2) + Math.pow(nodeA.y * 1 - nodeB.y * 1, 2)));
            link.weight_ab = weightAB;
        }
        ctx.fillText(weightAB,
            Math.abs(nodeA.x * 1 + nodeB.x * 1) / 2 + 5,
            Math.abs(nodeA.y * 1 + nodeB.y * 1) / 2 - 18);
        ctx.fillText(nodeA.id + " ⇒ " + nodeB.id,
            Math.abs(nodeA.x * 1 + nodeB.x * 1) / 2 - ((nodeA.id + " ⇒ " + nodeB.id).length - (weightAB + "").length),
            Math.abs(nodeA.y * 1 + nodeB.y * 1) / 2 - 5);

        ctx.fillStyle = "#c80415";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        weightBA = parseInt(link.weight_ba);
        if (weightBA === -1) {
            weightBA = Math.floor(Math.sqrt(Math.pow(nodeA.x * 1 - nodeB.x * 1, 2) + Math.pow(nodeA.y * 1 - nodeB.y * 1, 2)));
            link.weight_ba = weightBA;
        }
        ctx.fillText(weightBA,
            Math.abs(nodeA.x * 1 + nodeB.x * 1) / 2 - 5,
            Math.abs(nodeA.y * 1 + nodeB.y * 1) / 2 + 5);
        ctx.fillText(nodeB.id + " ⇒ " + nodeA.id,
            Math.abs(nodeA.x * 1 + nodeB.x * 1) / 2 + ((nodeA.id + " ⇒ " + nodeB.id).length - (weightAB + "").length),
            Math.abs(nodeA.y * 1 + nodeB.y * 1) / 2 + 18);
    };

    /**
     * Отрисовка канвы.
     */
    render = function () {
        /** Отчистка канвы */
        ctx.fillStyle = "#f3f3f3";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        /** Отчистка звязей между узлами */
        nodes.forEach(function (node) {
            node.linksA.forEach(function (link) {
                nodeA = getNodeById(link.id_a);
                nodeB = getNodeById(link.id_b);
                ctx.strokeStyle = "#000000";

                ctx.beginPath();
                ctx.moveTo(nodeA.x, nodeA.y);
                ctx.lineTo(nodeB.x, nodeB.y);
                ctx.stroke();

                drawText(link);
            });
        });

        /** Отрисовка узлов */
        ctx.fillStyle = "#000000";
        nodes.forEach(function (node) {
            var img = vertexPic,
                halfWidth = img.naturalWidth / 2,
                halfHeight = img.naturalHeight / 2;
            ctx.drawImage(img, node.x * 1 - halfWidth, node.y * 1 - halfHeight);
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(node.id, node.x, node.y);
        });

    };

    /**
     * Получает вершину по id
     *
     * @param id
     * @returns {*}
     */
    getNodeById = function (id) {
        var result = null;
        nodes.forEach(function (node) {
            if (node.id === id) {
                result = node;
            }
        });
        return result;
    };


    /**
     * Получает из события мыши координаты, относительно левого верхнего угла канвы.
     *
     * @param evt
     * @returns {{x: number, y: number}}
     */
    getMousePosFromEvent = function (evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };

    /**
     * Находит узел, находящийся по заданой координате на канве.
     *
     * @param pos - координаты
     * @returns {*}
     */
    getNodeByPos = function (pos) {
        var result = null;
        nodes.forEach(function (node) {
            var img = vertexPic, halfWidth = img.naturalWidth / 2, halfHeight = img.naturalHeight / 2;
            if ((pos.x >= node.x * 1 - halfWidth / 2) && (pos.x < node.x * 1 + halfWidth / 2) &&
                (pos.y >= node.y * 1 - halfHeight / 2) && (pos.y < node.y * 1 + halfHeight / 2)) {
                result = node;
            }
        });
        return result;
    };

    /**
     * При нажатии кнопки мыши находит узел по которому было нажатие,
     * запоминает его в dragNode для дальнейшего использования,
     * в dragPoint запоминаем по какому месту узла была нажата кнопка мыши.
     */
    canvas.addEventListener('mousedown', function (event) {
        var pos = getMousePosFromEvent(event);
        lastMousePosition = pos;
        if (getNodeByPos(pos) !== null) {
            dragNode = getNodeByPos(pos);
            if (dragNode !== undefined) {
                dragPoint = {
                    x: pos.x - dragNode.x,
                    y: pos.y - dragNode.y
                }
            }
        }
    }, false);

    /**
     *   При отпускании кпнопки мыши сохраняет положение вершины в БД
     */
    canvas.addEventListener('mouseup', function () {
        if (!event.ctrlKey || !event.metaKey) {
            if (dragNode !== undefined) {
                $.ajax({
                    url: "/site/save-position",
                    type: "POST",
                    data: {
                        "id": dragNode.id,
                        "x": dragNode.x,
                        "y": dragNode.y
                    }
                });
            }
            dragNode = undefined;
        }

    }, false);


    /**
     * При движении мыши, если есть перетаскиваемый узел, двигаем его и делаем render
     */
    canvas.addEventListener('mousemove', function (event) {
        var pos;
        if (!event.ctrlKey || !event.metaKey) {
            if (dragNode !== undefined) {
                pos = getMousePosFromEvent(event);
                dragNode.x = pos.x - dragPoint.x;
                dragNode.y = pos.y - dragPoint.y;
                render();
            }
        }
    }, false);

    /**
     * Получение данных с БД
     */
    getDataFromDataBase = function () {
        $.ajax({
            url: "/site/data",
            dataType: 'json'
        }).success(function (data) {
            console.log('data:', data);
            nodes = data.nodes;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            console.log('Получены данные с БД');
            render();
        }).error(function (data) {
            console.log(data);
            alert(data);
        });
    };

    /**
     * Создание массива, более подходящего для поиска пути
     *
     * @returns {Array}
     */
    getMassForPath = function () {
        result = [];
        nodes.forEach(function (node) {
            tmp = getLinkById(node.id);
            result.push(tmp);
        });
        return result;
    };

    /**
     * Получение массива связей по id
     *
     * @param id
     * @returns {Array}
     */
    getLinkById = function (id) {
        var result = [];
        nodes.forEach(function (node) {
            node.linksA.forEach(function (link) {
                if (link.id_b === id) {
                    result.push({
                        "id_a": link.id_b,
                        "id_b": link.id_a,
                        "weight": link.weight_ba
                    });
                } else if (link.id_a === id) {
                    result.push({
                        "id_a": link.id_a,
                        "id_b": link.id_b,
                        "weight": link.weight_ab
                    });
                }
            });
        });
        return result;
    };

    /**
     * Нахождения кратчайшего по весу пути от A до B
     *
     * @param beginID - id начальной вершины
     * @param endID - id конечной вершины
     */
    getShrotPath = function (beginID, endID) {
        render();
        deepRecursive = 0;
        var mass = getMassForPath();
        var closeNodes = [];

        /** Поиск списка элементов с начальной вершиной */
        mass.forEach(function (elem) {
            if (elem[0].id_a === beginID) {
                /** Запуск рекурсивной функции */
                getPath(elem, closeNodes, beginID, endID)
            }
        });
        console.log("PATH", path);
        var result = [], tmpVar = 0, min = 99999999999;
        /** Нахождения наименьшего по весу пути */
        path.forEach(function (elem) {
            elem.forEach(function (link) {
                tmpVar += parseFloat(link.weight);
            });
            if (tmpVar < min) {
                min = tmpVar;
                result = {
                    'weight': tmpVar,
                    'path': elem
                };
            }
            tmpVar = 0;
        });

        /** Отрисовка пути */
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#00c749";
        var nodeA, nodeB;
        result.path.forEach(function (path) {
            nodeA = getNodeById(path.id_a);
            nodeB = getNodeById(path.id_b);
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
        });

        nodes.forEach(function (node) {
            node.linksA.forEach(function (link) {
                drawText(link);
            });
            ctx.fillStyle = "#000000";
            var img = vertexPic,
                halfWidth = img.naturalWidth / 2,
                halfHeight = img.naturalHeight / 2;
            ctx.drawImage(img, node.x - halfWidth, node.y - halfHeight);
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(node.id, node.x, node.y);
        });
        path = [];
    };

    /**
     * Удаляет лишние элементы с массива пройденых вершин
     *
     * @param closeNodes - массив пройденных вершин
     * @returns {*}
     */
    clearCloseNodes = function (closeNodes) {
        var sizeCloseNodes = closeNodes.length;
        while (Math.abs(deepRecursive - sizeCloseNodes) > 0) {
            closeNodes.pop();
            if (deepRecursive > sizeCloseNodes) {
                deepRecursive--;
            }
            else {
                sizeCloseNodes--;
            }
        }
        return closeNodes;
    };

    /**
     * Копирует массив
     *
     * @param mass - исходный массив
     * @returns {Array}
     */
    copyMass = function (mass) {
        var result = [];
        mass.forEach(function (elem) {
            result.push(elem);
        });
        return result;
    };

    /**
     * Рекурсивная функция находжения всевозможных путей из A в B
     *
     * @param beginNode - массив элементов\путей из определенной вершины
     * @param closeNodes - массив пройденных вершин
     * @param beginID - id начальной вершины
     * @param endID - id конечной вершины
     */
    getPath = function (beginNode, closeNodes, beginID, endID) {
        /** Текущая глубина рекурсии */
        deepRecursive++;
        beginNode.forEach(function (elem) {
            /** "Чистка" массива с пройденными вершинами */
            closeNodes = clearCloseNodes(closeNodes);
            /** Проверка, была ли пройдена вершина */
            if (checkClosedNodeId(closeNodes, elem.id_b, beginID)) {
                /** Если не была пройдена, записываем связь в пройденные */
                closeNodes.push(elem);
                /** Проверяем дошел ли процесс до конечной вершины */
                if (elem.id_b === endID) {
                    /** Копируем и сохраняем массыв */
                    path.push(copyMass(closeNodes));
                } else {
                    /** Запуск рекурсии с новый елементом */
                    getPath(getLinkById(elem.id_b), closeNodes, beginID, endID);
                }
            }
        });
        deepRecursive--;
    };

    /**
     *  Проверяет, была ли пройденна вершина или нет
     *
     * @param closeNodes - массив пройденных вершин
     * @param id - id новой вершины
     * @param beginID - id начальной вершины
     * @returns {boolean}
     */
    checkClosedNodeId = function (closeNodes, id, beginID) {
        var result = true;
        closeNodes.forEach(function (node) {
            if (node.id_b === id || node.id_a === id || id === beginID) {
                result = false;
            }
        });
        return result;
    };

    getDataFromDataBase();
    render();
};
